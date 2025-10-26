'use client';

import { useState } from 'react';
import { WalletConnection } from '@concordium/wallet-connectors';
import { 
  CredentialStatement, 
  AtomicStatementV2,
  VerifiablePresentation,
} from '@concordium/web-sdk';

// Standard identity attribute tags
const ATTRIBUTE_TAGS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  SEX: 'sex',
  DATE_OF_BIRTH: 'dob',
  COUNTRY_OF_RESIDENCE: 'countryOfResidence',
  NATIONALITY: 'nationality',
  ID_DOC_TYPE: 'idDocType',
  ID_DOC_NUMBER: 'idDocNo',
  ID_DOC_ISSUER: 'idDocIssuer',
  ID_DOC_ISSUED_AT: 'idDocIssuedAt',
  ID_DOC_EXPIRES_AT: 'idDocExpiresAt',
  NATIONAL_ID_NUMBER: 'nationalIdNo',
  TAX_ID_NUMBER: 'taxIdNo',
};

interface IdentityAttributes {
  nationality?: string;
  idDocType?: string;
  idDocNumber?: string;
  idDocIssuer?: string;
  idDocIssuedAt?: string;
  idDocExpiresAt?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  countryOfResidence?: string;
  ageVerified?: boolean;
}

interface Props {
  connector: WalletConnection | null;
  account: string | undefined;
  onVerificationComplete: (status: 'success' | 'invalid' | 'expired') => void;
  isVerifying: boolean;
  setIsVerifying: (value: boolean) => void;
}

export function IdentityVerification({ connector, account, onVerificationComplete, isVerifying, setIsVerifying }: Props) {

  const requestIdentityProof = async () => {
    if (!connector || !account) {
      console.error('Wallet not connected');
      return;
    }

    try {
      setIsVerifying(true);

      // Helper function to get date 18 years ago
      const getPastDate = (years: number) => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - years);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      // Define the statements to prove
      const statements: AtomicStatementV2[] = [
        // Reveal nationality
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.NATIONALITY,
        },
        // Reveal ID document type
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.ID_DOC_TYPE,
        },
        // Reveal ID document number
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.ID_DOC_NUMBER,
        },
        // Reveal ID document issuer
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.ID_DOC_ISSUER,
        },
        // Reveal ID document issued date
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.ID_DOC_ISSUED_AT,
        },
        // Reveal ID document expiry date
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.ID_DOC_EXPIRES_AT,
        },
        // Reveal first name
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.FIRST_NAME,
        },
        // Reveal last name
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.LAST_NAME,
        },
        // Reveal country of residence
        {
          type: 'RevealAttribute',
          attributeTag: ATTRIBUTE_TAGS.COUNTRY_OF_RESIDENCE,
        },
        // Prove age >= 18 (date of birth before 18 years ago)
        {
          type: 'AttributeInRange',
          attributeTag: ATTRIBUTE_TAGS.DATE_OF_BIRTH,
          lower: '18000101', // Min date
          upper: getPastDate(18), // Max date (18 years ago)
        },
      ];

      const credentialStatement: CredentialStatement = {
        idQualifier: {
          type: 'cred' as const,
          // Allow identity providers 0-7 (all current providers)
          issuers: [0, 1, 2, 3, 4, 5, 6, 7],
        },
        statement: statements,
      };

      // Generate a random challenge
      const challengeBuffer = new Uint8Array(32);
      crypto.getRandomValues(challengeBuffer);
      const challenge = Buffer.from(challengeBuffer).toString('hex');

      console.log('Requesting verifiable presentation...');
      
      // Request verifiable presentation from wallet
      const presentation: VerifiablePresentation = await connector.requestVerifiablePresentation(
        challenge,
        [credentialStatement]
      );

      console.log('Presentation received:', presentation);

      // Parse the revealed attributes from the proof
      const attributes: IdentityAttributes = {
        ageVerified: true, // If we got here, age range proof passed
      };

      // Extract revealed attributes from the presentation
      if (presentation.verifiableCredential && presentation.verifiableCredential.length > 0) {
        const credential = presentation.verifiableCredential[0];
        const proofValues = credential.credentialSubject.proof.proofValue;

        // Parse the revealed attributes
        proofValues.forEach((proof: any, index: number) => {
          if (proof.type === 'RevealAttribute' && proof.attribute) {
            const statement = statements[index];
            const tag = statement?.attributeTag;
            
            if (tag === ATTRIBUTE_TAGS.NATIONALITY) {
              attributes.nationality = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.ID_DOC_TYPE) {
              attributes.idDocType = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.ID_DOC_NUMBER) {
              attributes.idDocNumber = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.ID_DOC_ISSUER) {
              attributes.idDocIssuer = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.ID_DOC_ISSUED_AT) {
              attributes.idDocIssuedAt = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.ID_DOC_EXPIRES_AT) {
              attributes.idDocExpiresAt = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.FIRST_NAME) {
              attributes.firstName = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.LAST_NAME) {
              attributes.lastName = proof.attribute;
            } else if (tag === ATTRIBUTE_TAGS.COUNTRY_OF_RESIDENCE) {
              attributes.countryOfResidence = proof.attribute;
            }
          }
        });
      }

      console.log('Parsed attributes:', attributes);

      // Check if age verification passed
      if (!attributes.ageVerified) {
        onVerificationComplete('invalid');
        return;
      }

      // Check document type (3 = Driving License)
      if (attributes.idDocType !== '3') {
        onVerificationComplete('invalid');
        return;
      }

      // Check if license is expired
      if (attributes.idDocExpiresAt) {
        const expiryDate = parseDate(attributes.idDocExpiresAt);
        const today = new Date();
        if (expiryDate < today) {
          onVerificationComplete('expired');
          return;
        }
      }

      // All checks passed
      onVerificationComplete('success');

    } catch (err) {
      console.error('Identity proof failed:', err);
      setIsVerifying(false);
    }
  };

  // Helper function to parse date string (format: YYYYMMDD)
  const parseDate = (dateStr: string): Date => {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  };

  return { requestIdentityProof };
}
