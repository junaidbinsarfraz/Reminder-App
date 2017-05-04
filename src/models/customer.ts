export class Customer {
 
    public policyNo: string;
    public policyOwner: string;
    public proposedInsured: string;
    public paymentMode: string;
    public dueDate: string;
    public methodOfPayment: string;
    public premium: string;
    public ccExpire?: string;
    public paid?: boolean;
    public cardRenewed?: boolean;

    constructor(policyNo: string = "", policyOwner: string = "", proposedInsured: string = "", paymentMode: string = "Monthly"
        , dueDate: string = "", methodOfPayment: string = "Direct Pay", premium: string = "", ccExpire: string = ""
        , paid: boolean = false, cardRenewed: boolean = false) {
            this.ccExpire = ccExpire;
            this.dueDate = dueDate;
            this.methodOfPayment = methodOfPayment;
            this.paymentMode = paymentMode;
            this.policyNo = policyNo;
            this.policyOwner = policyOwner;
            this.premium = premium;
            this.proposedInsured = proposedInsured;
    }

}