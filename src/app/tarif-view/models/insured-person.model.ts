export interface InsuredPerson {
    firstName: string;
    gender: number;
    dateOfBirth?: Date | string;
    postalCode: string;
    mutualType: string;
    coverType: number;
    relationNumber: number;
    isPaymentBankDomiciliation: number;
    assuredNumber: number;
    newAssure: string;
    action?: string; // C for create, U for update, D for delete
  }