using System.Data.Odbc;
using ImpulseSupportTool_Repo;
using OrderManagement.API.Helpers;
using Oracle.ManagedDataAccess.Client;
using OrderManagement.API.Helpers;



namespace OrderManagement.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly EnvironmentMapper _environmentMapper;

        public OrderRepository(EnvironmentMapper environmentMapper)
        {
            _environmentMapper = environmentMapper;
        }

        public async Task<OrderResponse> GetOrder(OrderRequest request)
        {
            Console.WriteLine(
                $">>> QUERY PARAMS: " +
                $"PoNumber='{request.PoNumber}' " +
                $"CountryCode='{request.CountryCode}' " +
                $"Environment='{request.Environment}'");

            string connectionString =
                _environmentMapper.GetOdsConnectionString(
                    request.Environment);

            Console.WriteLine(
                $">>> ODS ENVIRONMENT: {request.Environment}");

            await using OracleConnection conn =
                new OracleConnection(connectionString);

            await conn.OpenAsync();

            Console.WriteLine(
                ">>> ODS ORACLE CONNECTION OPENED OK");

            OrderResponse response = null;

            string headerQuery = @"
                    SELECT
                    COMPANY_CD,
                    BRANCH_NBR,
                    ORDR_NBR,
                    ORDR_DT,
                    CUST_ORDR_NBR,
                    BILL_TO_BRANCH_NBR,
                    BILL_TO_CUST_NBR,
                    BILL_TO_SFX,
                    SHIP_TO_SFX,
                    CAPS_ID_CD,
                    TERMS,
                    RESDNTL_SW,
                    BORDR_STUS,
                    ORDR_CMPLT_FILL_SW,
                    CR_RELS,
                    ENTY_DT,
                    TERM_ID,
                    OS_SLSMN,
                    IS_SLSMN,
                    PSTL_CD,
                    ENTY_MTHD,
                    EDI_CO,
                    SPLIT_SW,
                    ORD_REF_NBR,
                    FULFMT_SW,
                    CR_CRD_SW,
                    ENTY_TM,
                    BID_QOT_FLG,
                    BID_EXP_DT,
                    CCY_CD,
                    CCY_RATE,
                    PO_CRTD_SW,
                    GOVT_BID_FLG,
                    ENHCD_RMA_SW,
                    FLRNG_AUTH_ACTN_CD,
                    CU_BUS_SGMT,
                    CU_BUS_TYP,
                    CUA_SHIP_FROM,
                    BASE_RATE_ORDR_SW,
                    USER_NAM,
                    GOVT_END_USER_ZIP,
                    BIN_TYP,
                    GOVT_GSA_IND,
                    SPLIT_BILL_TO_SW,
                    GOVT_END_USER_TYP,
                    ODS_LST_UPD_DT,
                    ENHCD_CR_MEMO_SW,
                    IMS_DEL_FLG,
                    SPECIAL_HANDLE_SW,
                    CFG_FLG,
                    EU_PO_NBR,
                    RSLR_NBR,
                    TN_SPEC_CD,
                    EU_DATA_SW,
                    EU_AUTH,
                    EU_ADDR_SFX,
                    EU_VEND_FLG,
                    EU_NBR,
                    WAS_BORD,
                    JOB_ACCT_NBR,
                    CAPS_BYR,
                    ACK_CD,
                    COPY_CD,
                    EXT_SO_CD,
                    TAX_CD,
                    STATE_CD,
                    COUNTY_CD,
                    CITY_CD,
                    TRADE_DISC,
                    ORDR_MGMT_SW,
                    SRC_CD,
                    SUMM_INVC_CD,
                    CUST_TYP,
                    CUST_REF_NBR,
                    ORDR_VALU_AT_ADD,
                    GWMD_IMAG_APLY_FLG,
                    CUSTOMERS_LANG_CD,
                    GL_OFFST_NBR,
                    GL_OFFST_TYPE,
                    END_CUST_NUM,
                    FLRNG_AUTH_NBR,
                    ALNE_SW,
                    CUST_REF_NBR2,
                    CMPGN,
                    CONT,
                    END_USER_CONT_SFX,
                    FRT_FORWARDER,
                    END_USER_ORDR_SW,
                    AOD_SW,
                    CTRY_CD,
                    SOLD_TO_SFX,
                    PAYE_NBR,
                    PAYE_SFX,
                    RSLR_SPLIT_PCT,
                    DLVY_TERMS,
                    END_CUST_ID,
                    VENDOR_CLAIM_NBR,
                    INDIA_GST_ORDER_IND,
                    LAST_DIST_NBR,
                    LAST_SHIPMENT_NBR,
                    PRIORITY_CODE,
                    OUTSOURCE_SKU_IND,
                    DELETE_TODAY_SW,
                    PRICE_RECALC_SW
                    FROM ODS.ODS_ORDER
                    WHERE 
                    COMPANY_CD = :companyCode
                    AND CUST_ORDR_NBR = :poNumber";

            //   OR ORDR_NBR = :orderNumber

            await using OracleCommand cmd =
            new OracleCommand(headerQuery, conn);

            cmd.BindByName = true;

            cmd.Parameters.Add("poNumber", OracleDbType.Varchar2).Value = request.PoNumber.Trim();
            //cmd.Parameters.Add("orderNumber", OracleDbType.Varchar2).Value = request.OrderNumber.Trim();

            cmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = request.CountryCode.Trim();

            Console.WriteLine(
                ">>> EXECUTING ODS HEADER QUERY...");

            await using OracleDataReader reader = await cmd.ExecuteReaderAsync();

            Console.WriteLine(
                $">>> ODS HEADER READER HAS ROWS: {reader.HasRows}");

            if (await reader.ReadAsync())
            {
                Console.WriteLine(
                    ">>> ODS HEADER ROW FOUND - mapping response...");

                response = new OrderResponse
                {
                    CustCoCd = reader["COMPANY_CD"]?.ToString()?.Trim(),
                    CustBr = reader["BRANCH_NBR"]?.ToString()?.Trim(),
                    ImiAsgdOrdrNbr = reader["ORDR_NBR"]?.ToString()?.Trim(),
                    OrdrDt = reader["ORDR_DT"]?.ToString()?.Trim(),
                    CustPoNbr = reader["CUST_ORDR_NBR"]?.ToString()?.Trim(),
                    BillToBranchNbr = reader["BILL_TO_BRANCH_NBR"]?.ToString()?.Trim(),
                    BillToCustNbr = reader["BILL_TO_CUST_NBR"]?.ToString()?.Trim(),
                    BillToSfx = reader["BILL_TO_SFX"]?.ToString()?.Trim(),
                    ShipToSfx = reader["SHIP_TO_SFX"]?.ToString()?.Trim(),
                    CapsIdCd = reader["CAPS_ID_CD"]?.ToString()?.Trim(),
                    Terms = reader["TERMS"]?.ToString()?.Trim(),
                    ResdntlSw = reader["RESDNTL_SW"]?.ToString()?.Trim(),
                    OrdrStatus = reader["BORDR_STUS"]?.ToString()?.Trim(),
                    OrdrCmpltFillSw = reader["ORDR_CMPLT_FILL_SW"]?.ToString()?.Trim(),
                    CrRels = reader["CR_RELS"]?.ToString()?.Trim(),
                    EntyDt = reader["ENTY_DT"]?.ToString()?.Trim(),
                    TermId = reader["TERM_ID"]?.ToString()?.Trim(),
                    OsSlsmn = reader["OS_SLSMN"]?.ToString()?.Trim(),
                    IsSlsmn = reader["IS_SLSMN"]?.ToString()?.Trim(),
                    PostalCd = reader["PSTL_CD"]?.ToString()?.Trim(),
                    EntyMthd = reader["ENTY_MTHD"]?.ToString()?.Trim(),
                    EdiCo = reader["EDI_CO"]?.ToString()?.Trim(),
                    SplitSw = reader["SPLIT_SW"]?.ToString()?.Trim(),
                    OrdRefNbr = reader["ORD_REF_NBR"]?.ToString()?.Trim(),
                    FulmntSw = reader["FULFMT_SW"]?.ToString()?.Trim(),
                    CrCrdSw = reader["CR_CRD_SW"]?.ToString()?.Trim(),
                    EntyTm = reader["ENTY_TM"]?.ToString()?.Trim(),
                    BidQotFlg = reader["BID_QOT_FLG"]?.ToString()?.Trim(),
                    BidExpDt = reader["BID_EXP_DT"]?.ToString()?.Trim(),
                    OrdrCcyCd = reader["CCY_CD"]?.ToString()?.Trim(),
                    CcyRate = ToDecimalSafe(reader["CCY_RATE"]),
                    PoCrtedSw = reader["PO_CRTD_SW"]?.ToString()?.Trim(),
                    GovtBidFlg = reader["GOVT_BID_FLG"]?.ToString()?.Trim(),
                    EnhancedRmaSw = reader["ENHCD_RMA_SW"]?.ToString()?.Trim(),
                    FlrngAuthActnCd = reader["FLRNG_AUTH_ACTN_CD"]?.ToString()?.Trim(),
                    CuBusSgmt = reader["CU_BUS_SGMT"]?.ToString()?.Trim(),
                    CuBusTyp = reader["CU_BUS_TYP"]?.ToString()?.Trim(),
                    CuaShipFrom = reader["CUA_SHIP_FROM"]?.ToString()?.Trim(),
                    BaseRateOrdrSw = reader["BASE_RATE_ORDR_SW"]?.ToString()?.Trim(),
                    UserNam = reader["USER_NAM"]?.ToString()?.Trim(),
                    GovtEndUserZip = reader["GOVT_END_USER_ZIP"]?.ToString()?.Trim(),
                    BinTyp = reader["BIN_TYP"]?.ToString()?.Trim(),
                    GovtGsaInd = reader["GOVT_GSA_IND"]?.ToString()?.Trim(),
                    SplitBillToSw = reader["SPLIT_BILL_TO_SW"]?.ToString()?.Trim(),
                    GovtEndUserTyp = reader["GOVT_END_USER_TYP"]?.ToString()?.Trim(),
                    OdsLstUpdDt = reader["ODS_LST_UPD_DT"]?.ToString()?.Trim(),
                    EnhancedCrMemoSw = reader["ENHCD_CR_MEMO_SW"]?.ToString()?.Trim(),
                    ImsDelFlg = reader["IMS_DEL_FLG"]?.ToString()?.Trim(),
                    SpecialHandleSw = reader["SPECIAL_HANDLE_SW"]?.ToString()?.Trim(),
                    CfgFlg = reader["CFG_FLG"]?.ToString()?.Trim(),
                    EndUserPoNbr = reader["EU_PO_NBR"]?.ToString()?.Trim(),
                    ResellerNbr = reader["RSLR_NBR"]?.ToString()?.Trim(),
                    TnSpecCd = reader["TN_SPEC_CD"]?.ToString()?.Trim(),
                    EndUserDataSw = reader["EU_DATA_SW"]?.ToString()?.Trim(),
                    EndUserAuthorization = reader["EU_AUTH"]?.ToString()?.Trim(),
                    EndUserAddrSuffix = reader["EU_ADDR_SFX"]?.ToString()?.Trim(),
                    EndUserVendorFlag = reader["EU_VEND_FLG"]?.ToString()?.Trim(),
                    EndUserNbr = reader["EU_NBR"]?.ToString()?.Trim(),
                    WasBord = reader["WAS_BORD"]?.ToString()?.Trim(),
                    JobAcctNbr = reader["JOB_ACCT_NBR"]?.ToString()?.Trim(),
                    CapsBuyer = reader["CAPS_BYR"]?.ToString()?.Trim(),
                    AckCode = reader["ACK_CD"]?.ToString()?.Trim(),
                    CopyCode = reader["COPY_CD"]?.ToString()?.Trim(),
                    ExtSoCode = reader["EXT_SO_CD"]?.ToString()?.Trim(),
                    TaxCode = reader["TAX_CD"]?.ToString()?.Trim(),
                    StateCd = reader["STATE_CD"]?.ToString()?.Trim(),
                    CountyCode = reader["COUNTY_CD"]?.ToString()?.Trim(),
                    CityCode = reader["CITY_CD"]?.ToString()?.Trim(),
                    TradeDisc = ToDecimalSafe(reader["TRADE_DISC"]),
                    OrderManagementSw = reader["ORDR_MGMT_SW"]?.ToString()?.Trim(),
                    SourceCode = reader["SRC_CD"]?.ToString()?.Trim(),
                    SummInvoiceCode = reader["SUMM_INVC_CD"]?.ToString()?.Trim(),
                    CustType = reader["CUST_TYP"]?.ToString()?.Trim(),
                    CustRefNbr = reader["CUST_REF_NBR"]?.ToString()?.Trim(),
                    OrderValueAtAdd = ToDecimalSafe(reader["ORDR_VALU_AT_ADD"]),
                    GwmdImagApplyFlag = reader["GWMD_IMAG_APLY_FLG"]?.ToString()?.Trim(),
                    CustomersLanguageCode = reader["CUSTOMERS_LANG_CD"]?.ToString()?.Trim(),
                    GlOffsetNbr = reader["GL_OFFST_NBR"]?.ToString()?.Trim(),
                    GlOffsetType = reader["GL_OFFST_TYPE"]?.ToString()?.Trim(),
                    EndCustNum = reader["END_CUST_NUM"]?.ToString()?.Trim(),
                    FlrngAuthNbr = reader["FLRNG_AUTH_NBR"]?.ToString()?.Trim(),
                    AllianceSw = reader["ALNE_SW"]?.ToString()?.Trim(),
                    CustRefNbr2 = reader["CUST_REF_NBR2"]?.ToString()?.Trim(),
                    Campaign = reader["CMPGN"]?.ToString()?.Trim(),
                    Contract = reader["CONT"]?.ToString()?.Trim(),
                    EndUserContSuffix = reader["END_USER_CONT_SFX"]?.ToString()?.Trim(),
                    FreightForwarder = reader["FRT_FORWARDER"]?.ToString()?.Trim(),
                    EndUserOrderSw = reader["END_USER_ORDR_SW"]?.ToString()?.Trim(),
                    AodSw = reader["AOD_SW"]?.ToString()?.Trim(),
                    CountryCode = reader["CTRY_CD"]?.ToString()?.Trim(),
                    SoldToSuffix = reader["SOLD_TO_SFX"]?.ToString()?.Trim(),
                    PayeeNbr = reader["PAYE_NBR"]?.ToString()?.Trim(),
                    PayeeSuf = reader["PAYE_SFX"]?.ToString()?.Trim(),
                    ResellerSplitPct = ToDecimalSafe(reader["RSLR_SPLIT_PCT"]),
                    DeliveryTerms = reader["DLVY_TERMS"]?.ToString()?.Trim(),
                    EndCustId = reader["END_CUST_ID"]?.ToString()?.Trim(),
                    VendorClaimNbr = reader["VENDOR_CLAIM_NBR"]?.ToString()?.Trim(),
                    IndiaGstOrderInd = reader["INDIA_GST_ORDER_IND"]?.ToString()?.Trim(),
                    LastDistNbr = reader["LAST_DIST_NBR"]?.ToString()?.Trim(),
                    LastShipmentNbr = reader["LAST_SHIPMENT_NBR"]?.ToString()?.Trim(),
                    PriorityCode = reader["PRIORITY_CODE"]?.ToString()?.Trim(),
                    OutsourceSkuInd = reader["OUTSOURCE_SKU_IND"]?.ToString()?.Trim(),
                    DeleteTodaySw = reader["DELETE_TODAY_SW"]?.ToString()?.Trim(),
                    PriceRecalcSw = reader["PRICE_RECALC_SW"]?.ToString()?.Trim()
                };

                Console.WriteLine(
                    $">>> ROW MAPPED SUCCESSFULLY: " +
                    $"Company={response.CustCoCd}, " +
                    $"Branch={response.CustBr}, " +
                    $"CustomerOrder={response.CustPoNbr}, " +
                    $"OrderNumber={response.ImiAsgdOrdrNbr}");

            }
            else
            {
                Console.WriteLine(
                    ">>> NO ODS HEADER ROW FOUND");
            }


            if (response != null)
            {
                string lineQuery = @"
                SELECT
                    COMPANY_CD,
                    BRANCH_NBR,
                    ORDR_NBR,
                    DIST_NBR,
                    SHIP_NBR,
                    LINE_NBR,
                    ORDR_DT,
                    LINE_TYP,
                    IM_PART_NBR,
                    INV_IND,
                    LINE_STUS,
                    QTY_ORDED,
                    QTY_BORD,
                    QTY_SHPD,
                    COL_IND,
                    MC_ORIDE_SW,
                    UNIT_PRC,
                    UNIT_COST,
                    UM_ORIDE_SW,
                    UP_ORIDE_SW,
                    UC_ORIDE_SW,
                    VEND_NBR,
                    INV_UNIT_COST,
                    TERMS,
                    TAX_CD,
                    PRMS_DT,
                    OS_SLSMN,
                    IS_SLSMN,
                    ITEM_TYP,
                    DES,
                    XTRA_DES_SW,
                    BORDR_SW,
                    UNIT_WGT,
                    SYS_CMPNT_SW,
                    COMP_QTY_PER,
                    CNSGM_INV_SW,
                    ROLL_SW,
                    ENTY_DT,
                    MCHG_CD,
                    CUS_ORIG_UNIT_PRC,
                    SBSTUT_COST,
                    QTY_BILD,
                    FRT_IN_AMT_BILD,
                    ADJD_COST_SW,
                    FRT_OUT_AMT_BILD,
                    CANC_DT,
                    REBAT_AMT,
                    UPC_NBR,
                    CUA_SHIP_FROM,
                    ITEM_CNSND_SW,
                    LST_CHG_DT,
                    ACOP_COST_ORIDE_IND,
                    ACOP_RPRC_SW,
                    MAQ_IND,
                    VEND_PART_NBR,
                    ODS_LST_UPD_DT,
                    ADJ_COST,
                    ORIG_ADJ_COST,
                    IMS_DEL_FLG,
                    SERIAL_NBR_AVAIL_SW,
                    CUST_ITEM_NBR,
                    CUST_LINE_NBR,
                    RESERVE_TYPE_SW,
                    BO_ETA_DATE,
                    SPECIAL_SYSTEMS_COST,
                    RETAIL_PRICE,
                    CONV_BASE_PRICE,
                    CONFIG_UNIT_PRICE,
                    CFG_IND,
                    SYS_ITEM_LINE_NBR,
                    UM,
                    AGGR_CD,
                    CONFIG_ASMBY_CD,
                    CFG_LAB,
                    CAT_NBR,
                    FREE_ITEM_SW,
                    ICMS_TAX_AMT,
                    IPI_ISS_TAX_SW,
                    IPI_ISS_TAX_AMT,
                    LST_CHG_OPID,
                    LST_CHG_TM,
                    PC_TAX_AMT,
                    REL_GOVT_BID_VSN,
                    RESV_SEQ_NBR,
                    UNIT_PRC_RSLR,
                    FOREIGN_UNIT_PRICE,
                    ACTUAL_EXCHG_RATE,
                    VDR_EXCHG_RATE,
                    CONFIG_ID,
                    KEY_CO,
                    KEY_BR,
                    INV_BR_NBR,
                    SHT_IND,
                    REQ_PRFT_PCT,
                    COMMOD_CD,
                    IN_STK_BR,
                    IN_STK_OTH,
                    TRADE_DISC,
                    TR_TO_BR_NBR,
                    TR_TO_ORDR_NBR,
                    TR_TO_DIST_NBR,
                    TR_TO_SHIP_NBR,
                    WGT_PER,
                    RVS_ACOP_IND,
                    USYS_CONT_ACOP_IND,
                    SLS_TYP_SW,
                    BASE_UNIT,
                    BASE_UM,
                    NON_STD_CONV_SW,
                    FRGN_UNIT_PRC_SEMI,
                    VAT_TAX_CD,
                    VAT_TAX_RT,
                    COOP_FLG,
                    RMA_OVERGOODS_CD,
                    ALT_WHSE_CO,
                    ALT_WHSE_BR,
                    ALT_WHSE_CCY,
                    ALT_UNIT_COST,
                    ALNC_SW,
                    PROMO_CD,
                    CNTRY_OF_ORIG,
                    EXP_LICENCE,
                    ACOP_DELTA_PRC_IND,
                    ACOP_END_USER_NBR,
                    LSB_QTY_AVAIL,
                    VDR_EXCHG_RT_TYP,
                    TXBL_ITEM_SW,
                    ALLOC_RESV_QTY,
                    CFSCMP_SYS_ITEM_CO,
                    CFSCMP_SYS_ITEM_NBR,
                    ENTY_TM,
                    ASET_TAG_SW,
                    LSB,
                    REFDIR_OVRD_TYP,
                    SPLIT_BILL_TO_SUFF,
                    SPEC_COMP_IND,
                    OSS_NO,
                    AAP_BUILD_IND,
                    BOH_UPD_ONLINE_SW,
                    PGM_TYP1,
                    PGM_TYP2,
                    DISC_PCT,
                    DISC_CD,
                    SEMI_CNDUC_SW,
                    INVC_CO_CD,
                    INVC_BR_NBR,
                    INVC_ORDR_NBR,
                    INVC_INVC_DT,
                    INVC_DIST_NBR,
                    INVC_SHIP_NBR,
                    RELATED_GOVT_BID_GSN,
                    HOLD_CODE,
                    GOVT_BID_BASED_LINE_SW,
                    COMMOD_CODE,
                    REFDIR_OVERRIDE_TEXT,
                    ALLOC_TYPE,
                    ODS_ISRT_TS,
                    INVOICE_BREAK_CODE,
                    ENTRY_TIME,
                    ICMS_CODE,
                    ICMS_TAX_RATE,
                    IPI_ISS_TAX_RATE,
                    TES_CODE,
                    RMA_RECV_TODAY,
                    RMA_QTY_OPEN,
                    FAAST_SAP_INVC_NBR
                FROM ODS.ODS_ORDER_LINE
                WHERE COMPANY_CD = :companyCode
                  AND BRANCH_NBR = :BranchNbr
                  AND ORDR_NBR = :orderNumber";
                //       AND TRIM(DIST_NBR) = :DistNbr
                //       AND TRIM(SHIP_NBR) = :ShipNbr";

                await using OracleCommand lineCmd = new OracleCommand(lineQuery, conn);
                lineCmd.BindByName = true;
                lineCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = response.CustCoCd.Trim();
                lineCmd.Parameters.Add("orderNumber", OracleDbType.Varchar2).Value = response.ImiAsgdOrdrNbr.Trim();
                lineCmd.Parameters.Add("BranchNbr", OracleDbType.Varchar2).Value = response.CustBr.Trim();

                Console.WriteLine($">>> EXECUTING ODS LINE QUERY: COMPANY_CD='{response.CustCoCd}', ORDR_NBR='{response.ImiAsgdOrdrNbr}'");
                await using OracleDataReader lineReader = await lineCmd.ExecuteReaderAsync();
                Console.WriteLine($">>> ODS LINE READER HAS ROWS: {lineReader.HasRows}");

                while (await lineReader.ReadAsync())
                {
                    response.LineItems.Add(new OrderLineItem
                    {
                        CompanyCd = lineReader["COMPANY_CD"]?.ToString()?.Trim(),
                        BranchNbr = lineReader["BRANCH_NBR"]?.ToString()?.Trim(),
                        OrdrNbr = lineReader["ORDR_NBR"]?.ToString()?.Trim(),
                        DistNbr = lineReader["DIST_NBR"]?.ToString()?.Trim(),
                        ShipNbr = lineReader["SHIP_NBR"]?.ToString()?.Trim(),
                        LineNbr = lineReader["LINE_NBR"]?.ToString()?.Trim(),
                        OrdrDt = lineReader["ORDR_DT"]?.ToString()?.Trim(),
                        LineTyp = lineReader["LINE_TYP"]?.ToString()?.Trim(),
                        ImPartNbr = lineReader["IM_PART_NBR"]?.ToString()?.Trim(),
                        InvInd = lineReader["INV_IND"]?.ToString()?.Trim(),
                        LineStus = lineReader["LINE_STUS"]?.ToString()?.Trim(),
                        QtyOrded = lineReader["QTY_ORDED"]?.ToString()?.Trim(),
                        QtyBord = lineReader["QTY_BORD"]?.ToString()?.Trim(),
                        QtyShpd = lineReader["QTY_SHPD"]?.ToString()?.Trim(),
                        ColInd = lineReader["COL_IND"]?.ToString()?.Trim(),
                        McOrideSw = lineReader["MC_ORIDE_SW"]?.ToString()?.Trim(),
                        UnitPrc = lineReader["UNIT_PRC"]?.ToString()?.Trim(),
                        UnitCost = lineReader["UNIT_COST"]?.ToString()?.Trim(),
                        UmOrideSw = lineReader["UM_ORIDE_SW"]?.ToString()?.Trim(),
                        UpOrideSw = lineReader["UP_ORIDE_SW"]?.ToString()?.Trim(),
                        UcOrideSw = lineReader["UC_ORIDE_SW"]?.ToString()?.Trim(),
                        VendNbr = lineReader["VEND_NBR"]?.ToString()?.Trim(),
                        InvUnitCost = lineReader["INV_UNIT_COST"]?.ToString()?.Trim(),
                        Terms = lineReader["TERMS"]?.ToString()?.Trim(),
                        TaxCd = lineReader["TAX_CD"]?.ToString()?.Trim(),
                        PrmsDt = lineReader["PRMS_DT"]?.ToString()?.Trim(),
                        OsSlsmn = lineReader["OS_SLSMN"]?.ToString()?.Trim(),
                        IsSlsmn = lineReader["IS_SLSMN"]?.ToString()?.Trim(),
                        ItemTyp = lineReader["ITEM_TYP"]?.ToString()?.Trim(),
                        Des = lineReader["DES"]?.ToString()?.Trim(),
                        XtraDesSw = lineReader["XTRA_DES_SW"]?.ToString()?.Trim(),
                        BordrSw = lineReader["BORDR_SW"]?.ToString()?.Trim(),
                        UnitWgt = lineReader["UNIT_WGT"]?.ToString()?.Trim(),
                        SysCmpntSw = lineReader["SYS_CMPNT_SW"]?.ToString()?.Trim(),
                        CompQtyPer = lineReader["COMP_QTY_PER"]?.ToString()?.Trim(),
                        CnsgmInvSw = lineReader["CNSGM_INV_SW"]?.ToString()?.Trim(),
                        RollSw = lineReader["ROLL_SW"]?.ToString()?.Trim(),
                        EntyDt = lineReader["ENTY_DT"]?.ToString()?.Trim(),
                        MchgCd = lineReader["MCHG_CD"]?.ToString()?.Trim(),
                        CusOrigUnitPrc = lineReader["CUS_ORIG_UNIT_PRC"]?.ToString()?.Trim(),
                        SbstutCost = lineReader["SBSTUT_COST"]?.ToString()?.Trim(),
                        QtyBild = lineReader["QTY_BILD"]?.ToString()?.Trim(),
                        FrtInAmtBild = lineReader["FRT_IN_AMT_BILD"]?.ToString()?.Trim(),
                        AdjdCostSw = lineReader["ADJD_COST_SW"]?.ToString()?.Trim(),
                        FrtOutAmtBild = lineReader["FRT_OUT_AMT_BILD"]?.ToString()?.Trim(),
                        CancDt = lineReader["CANC_DT"]?.ToString()?.Trim(),
                        RebatAmt = lineReader["REBAT_AMT"]?.ToString()?.Trim(),
                        UpcNbr = lineReader["UPC_NBR"]?.ToString()?.Trim(),
                        CuaShipFrom = lineReader["CUA_SHIP_FROM"]?.ToString()?.Trim(),
                        ItemCnsndSw = lineReader["ITEM_CNSND_SW"]?.ToString()?.Trim(),
                        LstChgDt = lineReader["LST_CHG_DT"]?.ToString()?.Trim(),
                        AcopCostOrideInd = lineReader["ACOP_COST_ORIDE_IND"]?.ToString()?.Trim(),
                        AcopRprcSw = lineReader["ACOP_RPRC_SW"]?.ToString()?.Trim(),
                        MaqInd = lineReader["MAQ_IND"]?.ToString()?.Trim(),
                        VendPartNbr = lineReader["VEND_PART_NBR"]?.ToString()?.Trim(),
                        OdsLstUpdDt = lineReader["ODS_LST_UPD_DT"]?.ToString()?.Trim(),
                        AdjCost = lineReader["ADJ_COST"]?.ToString()?.Trim(),
                        OrigAdjCost = lineReader["ORIG_ADJ_COST"]?.ToString()?.Trim(),
                        ImsDelFlg = lineReader["IMS_DEL_FLG"]?.ToString()?.Trim(),
                        SerialNbrAvailSw = lineReader["SERIAL_NBR_AVAIL_SW"]?.ToString()?.Trim(),
                        CustItemNbr = lineReader["CUST_ITEM_NBR"]?.ToString()?.Trim(),
                        CustLineNbr = lineReader["CUST_LINE_NBR"]?.ToString()?.Trim(),
                        ReserveTypeSw = lineReader["RESERVE_TYPE_SW"]?.ToString()?.Trim(),
                        BoEtaDate = lineReader["BO_ETA_DATE"]?.ToString()?.Trim(),
                        SpecialSystemsCost = lineReader["SPECIAL_SYSTEMS_COST"]?.ToString()?.Trim(),
                        RetailPrice = lineReader["RETAIL_PRICE"]?.ToString()?.Trim(),
                        ConvBasePrice = lineReader["CONV_BASE_PRICE"]?.ToString()?.Trim(),
                        ConfigUnitPrice = lineReader["CONFIG_UNIT_PRICE"]?.ToString()?.Trim(),
                        CfgInd = lineReader["CFG_IND"]?.ToString()?.Trim(),
                        SysItemLineNbr = lineReader["SYS_ITEM_LINE_NBR"]?.ToString()?.Trim(),
                        Um = lineReader["UM"]?.ToString()?.Trim(),
                        AggrCd = lineReader["AGGR_CD"]?.ToString()?.Trim(),
                        ConfigAsmbyCd = lineReader["CONFIG_ASMBY_CD"]?.ToString()?.Trim(),
                        CfgLab = lineReader["CFG_LAB"]?.ToString()?.Trim(),
                        CatNbr = lineReader["CAT_NBR"]?.ToString()?.Trim(),
                        FreeItemSw = lineReader["FREE_ITEM_SW"]?.ToString()?.Trim(),
                        IcmsTaxAmt = lineReader["ICMS_TAX_AMT"]?.ToString()?.Trim(),
                        IpiIssTaxSw = lineReader["IPI_ISS_TAX_SW"]?.ToString()?.Trim(),
                        IpiIssTaxAmt = lineReader["IPI_ISS_TAX_AMT"]?.ToString()?.Trim(),

                        LastChgOpid = lineReader["LST_CHG_OPID"]?.ToString()?.Trim(),

                        LastChgTm = lineReader["LST_CHG_TM"]?.ToString()?.Trim(),
                        PcTaxAmt = lineReader["PC_TAX_AMT"]?.ToString()?.Trim(),
                        RelGovtBidVsn = lineReader["REL_GOVT_BID_VSN"]?.ToString()?.Trim(),
                        ResvSeqNbr = lineReader["RESV_SEQ_NBR"]?.ToString()?.Trim(),
                        UnitPriceRslr = lineReader["UNIT_PRC_RSLR"]?.ToString()?.Trim(),
                        ForeignUnitPrice = lineReader["FOREIGN_UNIT_PRICE"]?.ToString()?.Trim(),
                        ActualExchgRate = lineReader["ACTUAL_EXCHG_RATE"]?.ToString()?.Trim(),
                        VdrExchgRate = lineReader["VDR_EXCHG_RATE"]?.ToString()?.Trim(),
                        ConfigId = lineReader["CONFIG_ID"]?.ToString()?.Trim(),
                        KeyCo = lineReader["KEY_CO"]?.ToString()?.Trim(),
                        KeyBr = lineReader["KEY_BR"]?.ToString()?.Trim(),
                        InvBrNbr = lineReader["INV_BR_NBR"]?.ToString()?.Trim(),
                        ShtInd = lineReader["SHT_IND"]?.ToString()?.Trim(),
                        ReqPrftPct = lineReader["REQ_PRFT_PCT"]?.ToString()?.Trim(),
                        CommodCd = lineReader["COMMOD_CD"]?.ToString()?.Trim(),
                        InStkBr = lineReader["IN_STK_BR"]?.ToString()?.Trim(),
                        InStkOth = lineReader["IN_STK_OTH"]?.ToString()?.Trim(),
                        TradeDisc = lineReader["TRADE_DISC"]?.ToString()?.Trim(),
                        TrToBrNbr = lineReader["TR_TO_BR_NBR"]?.ToString()?.Trim(),
                        TrToOrdrNbr = lineReader["TR_TO_ORDR_NBR"]?.ToString()?.Trim(),
                        TrToDistNbr = lineReader["TR_TO_DIST_NBR"]?.ToString()?.Trim(),
                        TrToShipNbr = lineReader["TR_TO_SHIP_NBR"]?.ToString()?.Trim(),
                        WgtPer = lineReader["WGT_PER"]?.ToString()?.Trim(),
                        RvsAcopInd = lineReader["RVS_ACOP_IND"]?.ToString()?.Trim(),
                        UsysContAcopInd = lineReader["USYS_CONT_ACOP_IND"]?.ToString()?.Trim(),
                        SlsTypSw = lineReader["SLS_TYP_SW"]?.ToString()?.Trim(),
                        BaseUnit = lineReader["BASE_UNIT"]?.ToString()?.Trim(),
                        BaseUm = lineReader["BASE_UM"]?.ToString()?.Trim(),
                        NonStdConvSw = lineReader["NON_STD_CONV_SW"]?.ToString()?.Trim(),
                        FrgnUnitPrcSemi = lineReader["FRGN_UNIT_PRC_SEMI"]?.ToString()?.Trim(),
                        VatTaxCd = lineReader["VAT_TAX_CD"]?.ToString()?.Trim(),
                        VatTaxRt = lineReader["VAT_TAX_RT"]?.ToString()?.Trim(),
                        CoopFlg = lineReader["COOP_FLG"]?.ToString()?.Trim(),
                        RmaOvergoodsCd = lineReader["RMA_OVERGOODS_CD"]?.ToString()?.Trim(),
                        AltWhseCo = lineReader["ALT_WHSE_CO"]?.ToString()?.Trim(),
                        AltWhseBr = lineReader["ALT_WHSE_BR"]?.ToString()?.Trim(),
                        AltWhseCcy = lineReader["ALT_WHSE_CCY"]?.ToString()?.Trim(),
                        AltUnitCost = lineReader["ALT_UNIT_COST"]?.ToString()?.Trim(),
                        AlncSw = lineReader["ALNC_SW"]?.ToString()?.Trim(),
                        PromoCd = lineReader["PROMO_CD"]?.ToString()?.Trim(),
                        CntryOfOrig = lineReader["CNTRY_OF_ORIG"]?.ToString()?.Trim(),
                        ExpLicence = lineReader["EXP_LICENCE"]?.ToString()?.Trim(),
                        AcopDeltaPrcInd = lineReader["ACOP_DELTA_PRC_IND"]?.ToString()?.Trim(),
                        AcopEndUserNbr = lineReader["ACOP_END_USER_NBR"]?.ToString()?.Trim(),
                        LsbQtyAvail = lineReader["LSB_QTY_AVAIL"]?.ToString()?.Trim(),
                        VdrExchgRtTyp = lineReader["VDR_EXCHG_RT_TYP"]?.ToString()?.Trim(),
                        TxblItemSw = lineReader["TXBL_ITEM_SW"]?.ToString()?.Trim(),
                        AllocResvQty = lineReader["ALLOC_RESV_QTY"]?.ToString()?.Trim(),
                        CfscmpSysItemCo = lineReader["CFSCMP_SYS_ITEM_CO"]?.ToString()?.Trim(),
                        CfscmpSysItemNbr = lineReader["CFSCMP_SYS_ITEM_NBR"]?.ToString()?.Trim(),
                        EntyTm = lineReader["ENTY_TM"]?.ToString()?.Trim(),
                        AsetTagSw = lineReader["ASET_TAG_SW"]?.ToString()?.Trim(),
                        Lsb = lineReader["LSB"]?.ToString()?.Trim(),
                        RefdirOvrdTyp = lineReader["REFDIR_OVRD_TYP"]?.ToString()?.Trim(),
                        SplitBillToSuff = lineReader["SPLIT_BILL_TO_SUFF"]?.ToString()?.Trim(),
                        SpecCompInd = lineReader["SPEC_COMP_IND"]?.ToString()?.Trim(),
                        OssNo = lineReader["OSS_NO"]?.ToString()?.Trim(),
                        AapBuildInd = lineReader["AAP_BUILD_IND"]?.ToString()?.Trim(),
                        BohUpdOnlineSw = lineReader["BOH_UPD_ONLINE_SW"]?.ToString()?.Trim(),
                        PgmTyp1 = lineReader["PGM_TYP1"]?.ToString()?.Trim(),
                        PgmTyp2 = lineReader["PGM_TYP2"]?.ToString()?.Trim(),
                        DiscPct = lineReader["DISC_PCT"]?.ToString()?.Trim(),
                        DiscCd = lineReader["DISC_CD"]?.ToString()?.Trim(),
                        SemiCnducSw = lineReader["SEMI_CNDUC_SW"]?.ToString()?.Trim(),
                        InvcCoCd = lineReader["INVC_CO_CD"]?.ToString()?.Trim(),
                        InvcBrNbr = lineReader["INVC_BR_NBR"]?.ToString()?.Trim(),
                        InvcOrdrNbr = lineReader["INVC_ORDR_NBR"]?.ToString()?.Trim(),
                        InvcInvcDt = lineReader["INVC_INVC_DT"]?.ToString()?.Trim(),
                        InvcDistNbr = lineReader["INVC_DIST_NBR"]?.ToString()?.Trim(),
                        InvcShipNbr = lineReader["INVC_SHIP_NBR"]?.ToString()?.Trim(),
                        RelatedGovtBidGsn = lineReader["RELATED_GOVT_BID_GSN"]?.ToString()?.Trim(),
                        HoldCode = lineReader["HOLD_CODE"]?.ToString()?.Trim(),
                        GovtBidBasedLineSw = lineReader["GOVT_BID_BASED_LINE_SW"]?.ToString()?.Trim(),
                        RefdirOverrideText = lineReader["REFDIR_OVERRIDE_TEXT"]?.ToString()?.Trim(),
                        AllocType = lineReader["ALLOC_TYPE"]?.ToString()?.Trim(),
                        OdsIsrtTs = lineReader["ODS_ISRT_TS"]?.ToString()?.Trim(),
                        InvoiceBreakCode = lineReader["INVOICE_BREAK_CODE"]?.ToString()?.Trim(),
                        EntryTime = lineReader["ENTRY_TIME"]?.ToString()?.Trim(),
                        IcmsCode = lineReader["ICMS_CODE"]?.ToString()?.Trim(),
                        IcmsTaxRate = lineReader["ICMS_TAX_RATE"]?.ToString()?.Trim(),
                        IpiIssTaxRate = lineReader["IPI_ISS_TAX_RATE"]?.ToString()?.Trim(),
                        TesCode = lineReader["TES_CODE"]?.ToString()?.Trim(),
                        RmaRecvToday = lineReader["RMA_RECV_TODAY"]?.ToString()?.Trim(),
                        RmaQtyOpen = lineReader["RMA_QTY_OPEN"]?.ToString()?.Trim(),
                        FaastSapInvcNbr = lineReader["FAAST_SAP_INVC_NBR"]?.ToString()?.Trim()

                    });
                }

                Console.WriteLine($">>> ODS LINE ITEMS FOUND: {response.LineItems.Count}");
            }

            string statusQuery = @"
            SELECT
                CO_CD,
                ORDR_BR_NBR,
                ORDR_NBR,
                DIST_NBR,
                SHIP_NBR,
                ORDR_DT,
                STUS_CHG_TYP_CD,
                STUS_CHG_TS,
                ORDR_LINE_NBR,
                CUST_BR_NBR,
                CUST_NBR,
                WEB_PROCS_FLG,
                TOMCAT_PROCS_FLG,
                ORDR_CHG_STUS_CD,
                CONFIG_STUS_CD,
                AGGREGATE_ID,
                PRMS_CHG_DT,
                FAMILY_CD,
                LST_CHG_PROG_NAM,
                LST_CHG_OPER_ID,
                UPDT_RSN_TXT,
                EVNT_RSN_CD,
                FLR_DNL_QTY,
                LAST_CHG_APPL_ID,
                TRANS_AUTH_ID,
                CORREL_ID,
                PLAN_NAM,
                ODS_ISRT_TS,
                ODS_UPD_TS
            FROM ODS.DB2_OR_ORDER_STUS_CHGS
            WHERE CO_CD = :companyCode
              AND ORDR_NBR = :orderNumber
              AND ORDR_BR_NBR = :branchNumber";

            //    AND DIST_NBR = :distNumber
            //    AND SHIP_NBR = :shipNumber";

            try
            {
                await using OracleCommand statusCmd = new OracleCommand(statusQuery, conn);
                statusCmd.BindByName = true;

                statusCmd.Parameters.Add("orderNumber", OracleDbType.Varchar2).Value = response.ImiAsgdOrdrNbr?.Trim();
                statusCmd.Parameters.Add("branchNumber", OracleDbType.Varchar2).Value = response.CustBr?.Trim();
                statusCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = response.CustCoCd?.Trim();

                Console.WriteLine($">>> EXECUTING ODS STATUS CHANGE QUERY...");
                Console.WriteLine($">>> STATUS PARAMS: CO_CD='{response.CustCoCd}', ORDR_BR_NBR='{response.CustBr}', ORDR_NBR='{response.ImiAsgdOrdrNbr}'");

                await using OracleDataReader statusReader = await statusCmd.ExecuteReaderAsync();

                Console.WriteLine($">>> ODS STATUS READER HAS ROWS: {statusReader.HasRows}");

                while (await statusReader.ReadAsync())
                {

                    response.StatusChanges.Add(new OrderStatusChange
                    {
                        CoCd = statusReader["CO_CD"]?.ToString()?.Trim(),
                        OrdrBrNbr = statusReader["ORDR_BR_NBR"]?.ToString()?.Trim(),
                        OrdrNbr = statusReader["ORDR_NBR"]?.ToString()?.Trim(),
                        DistNbr = statusReader["DIST_NBR"]?.ToString()?.Trim(),
                        ShipNbr = statusReader["SHIP_NBR"]?.ToString()?.Trim(),
                        OrdrDt = statusReader["ORDR_DT"]?.ToString()?.Trim(),
                        StusChgTypCd = statusReader["STUS_CHG_TYP_CD"]?.ToString()?.Trim(),
                        StusChgTs = statusReader["STUS_CHG_TS"]?.ToString()?.Trim(),
                        OrdrLineNbr = statusReader["ORDR_LINE_NBR"]?.ToString()?.Trim(),
                        CustBrNbr = statusReader["CUST_BR_NBR"]?.ToString()?.Trim(),
                        CustNbr = statusReader["CUST_NBR"]?.ToString()?.Trim(),
                        WebProcsFlg = statusReader["WEB_PROCS_FLG"]?.ToString()?.Trim(),
                        TomcatProcsFlg = statusReader["TOMCAT_PROCS_FLG"]?.ToString()?.Trim(),
                        OrdrChgStusCd = statusReader["ORDR_CHG_STUS_CD"]?.ToString()?.Trim(),
                        ConfigStusCd = statusReader["CONFIG_STUS_CD"]?.ToString()?.Trim(),
                        AggregateId = statusReader["AGGREGATE_ID"]?.ToString()?.Trim(),
                        PrmsChgDt = statusReader["PRMS_CHG_DT"]?.ToString()?.Trim(),
                        FamilyCd = statusReader["FAMILY_CD"]?.ToString()?.Trim(),
                        LstChgProgNam = statusReader["LST_CHG_PROG_NAM"]?.ToString()?.Trim(),
                        LstChgOperId = statusReader["LST_CHG_OPER_ID"]?.ToString()?.Trim(),
                        UpdtRsnTxt = statusReader["UPDT_RSN_TXT"]?.ToString()?.Trim(),
                        EvntRsnCd = statusReader["EVNT_RSN_CD"]?.ToString()?.Trim(),
                        FlrDnlQty = ToDecimalSafe(statusReader["FLR_DNL_QTY"]),
                        LastChgApplId = statusReader["LAST_CHG_APPL_ID"]?.ToString()?.Trim(),
                        TransAuthId = statusReader["TRANS_AUTH_ID"]?.ToString()?.Trim(),
                        CorrelId = statusReader["CORREL_ID"]?.ToString()?.Trim(),
                        PlanNam = statusReader["PLAN_NAM"]?.ToString()?.Trim(),
                        OdsIsrtTs = statusReader["ODS_ISRT_TS"]?.ToString()?.Trim(),
                        OdsUpdTs = statusReader["ODS_UPD_TS"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> ODS STATUS CHANGE QUERY FAILED: {ex.Message}");
            }

            Console.WriteLine($">>> ODS STATUS CHANGES FOUND: {response.StatusChanges.Count}");


            string eoheaderQuery = @"
            SELECT 
                PARTNER_ID, 
                STATE_CD
            FROM ODS.DB2_EO_ORDR_HDR_INFO 
            WHERE CUST_CO_CD = :companyCode
            AND CUST_PO_NBR = :custPoNbr";

            try
            {
                await using OracleCommand eoheaderCmd = new OracleCommand(eoheaderQuery, conn);
                eoheaderCmd.BindByName = true;

                eoheaderCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = response.CustCoCd?.Trim();
                eoheaderCmd.Parameters.Add("custPoNbr", OracleDbType.Varchar2).Value = response.CustPoNbr?.Trim();

                Console.WriteLine($">>> EXECUTING ODS EO HEADER QUERY...");
                Console.WriteLine($">>> EO HEADER PARAMS: COMPANY_CODE='{response.CustCoCd}', CUST_PO_NBR='{response.CustPoNbr}'");

                using OracleDataReader eohreader = (OracleDataReader)await eoheaderCmd.ExecuteReaderAsync();
                Console.WriteLine($">>> READER HAS ROWS: {eohreader.HasRows}");

                if (await eohreader.ReadAsync())
                {
                    response.EoPartnerId =eohreader["PARTNER_ID"]?.ToString()?.Trim();
                    response.EoStateCd =eohreader["STATE_CD"]?.ToString()?.Trim();

                    Console.WriteLine($">>> EO HEADER FOUND: PartnerId='{response.EoPartnerId}', " +$"StateCd='{response.EoStateCd}'");
                }
                else
                {
                    Console.WriteLine($">>> NO EO HEADER FOUND FOR COMPANY_CODE='{response.CustCoCd}', CUST_PO_NBR='{response.CustPoNbr}'");
                }


            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> ODS EO HEADER QUERY FAILED: {ex.Message}");
            }

            //string combinedValue =
            //                            $"{ response.CustCoCd?.Trim()}" +
            //                            $"{response.BillToBranchNbr?.Trim()}" +
            //                            $"{response.BillToCustNbr?.Trim()}" +
            //                            $"{response.BillToSfx?.Trim()}";

            string partnerQuery = @"
                SELECT
                    CO_CD,
                    PARTNER_ID,
                    PARTNER_TYPE_CD,
                    SRCE_SYS_ID,
                    SRCE_SYS_KEY_ID,
                    FORMAT_ID,
                    DIR_FLG_CD,
                    DOC_ID,
                    FREQ_ID,
                    DATA_STORE_MECH_ID,
                    COMMU_ID,
                    INTERNET_ADDR_TXT,
                    ACTV_DT,
                    DEACTV_DT,
                    HOLD_CD,
                    SETUP_NOTES_TXT,
                    SEND_THRU_ID,
                    LST_CHG_TS,
                    LST_CHG_NAM,
                    PRCS_OPTN_FLG,
                    CYCLE_INTVL,
                    CYCLE_LST_RUN_TS,
                    BATCH_SPLIT_CNT,
                    CYC_STRT_TM,
                    CYC_END_TM,
                    OVRD_APPL_BATCH_ID,
                    TRANS_AUTH_ID,
                    CORREL_ID,
                    PLAN_NAM,
                    ODS_ISRT_TS,
                    ODS_UPD_TS
                FROM ODS.DB2_IE_PARTNER_SETUP
                WHERE CO_CD = :pco_cd
                  AND TRIM(PARTNER_ID) = :ppartner_id";

            string partnerCoCd = response.CustCoCd?.Trim() switch
            {
                "MD" => "US",
                "FT" => "CA",
                _ => response.CustCoCd?.Trim()
            };

            Console.WriteLine(
                $">>> PARTNER SETUP CO_CD: Incoming={response.CustCoCd}, QueryValue={partnerCoCd}");

            try
            {
                await using OracleCommand partnerCmd =
                    new OracleCommand(partnerQuery, conn);

                partnerCmd.BindByName = true;

                partnerCmd.Parameters.Add(
                    "pco_cd",
                    OracleDbType.Varchar2
                ).Value = partnerCoCd ?? (object)DBNull.Value;

                partnerCmd.Parameters.Add(
                    "ppartner_id",
                    OracleDbType.Varchar2
                ).Value = response.EoPartnerId?.Trim() ?? (object)DBNull.Value;

                Console.WriteLine(">>> EXECUTING ODS PARTNER SETUP QUERY...");
                Console.WriteLine($">>> PARTNER CO_CD PARAMETER: {partnerCoCd}");
                Console.WriteLine($">>> PARTNER ID PARAMETER: {response.EoPartnerId?.Trim()}");

                await using OracleDataReader partnerReader =
                    await partnerCmd.ExecuteReaderAsync();

                Console.WriteLine(
                    $">>> ODS PARTNER SETUP READER HAS ROWS: {partnerReader.HasRows}");

                while (await partnerReader.ReadAsync())
                {
                    response.PartnerSetup.Add(new OrderPartnerSetup
                    {
                        CoCd = partnerReader["CO_CD"]?.ToString()?.Trim(),
                        PartnerId = partnerReader["PARTNER_ID"]?.ToString()?.Trim(),
                        PartnerTypeCd = partnerReader["PARTNER_TYPE_CD"]?.ToString()?.Trim(),
                        SrceSysId = partnerReader["SRCE_SYS_ID"]?.ToString()?.Trim(),
                        SrceSysKeyId = partnerReader["SRCE_SYS_KEY_ID"]?.ToString()?.Trim(),
                        FormatId = partnerReader["FORMAT_ID"]?.ToString()?.Trim(),
                        DirFlgCd = partnerReader["DIR_FLG_CD"]?.ToString()?.Trim(),
                        DocId = partnerReader["DOC_ID"]?.ToString()?.Trim(),
                        FreqId = partnerReader["FREQ_ID"]?.ToString()?.Trim(),
                        DataStoreMechId = partnerReader["DATA_STORE_MECH_ID"]?.ToString()?.Trim(),
                        CommuId = partnerReader["COMMU_ID"]?.ToString()?.Trim(),
                        InternetAddrTxt = partnerReader["INTERNET_ADDR_TXT"]?.ToString()?.Trim(),
                        ActvDt = partnerReader["ACTV_DT"]?.ToString()?.Trim(),
                        DeactvDt = partnerReader["DEACTV_DT"]?.ToString()?.Trim(),
                        HoldCd = partnerReader["HOLD_CD"]?.ToString()?.Trim(),
                        SetupNotesTxt = partnerReader["SETUP_NOTES_TXT"]?.ToString()?.Trim(),
                        SendThruId = partnerReader["SEND_THRU_ID"]?.ToString()?.Trim(),
                        LstChgTs = partnerReader["LST_CHG_TS"]?.ToString()?.Trim(),
                        LstChgNam = partnerReader["LST_CHG_NAM"]?.ToString()?.Trim(),
                        PrcsOptnFlg = partnerReader["PRCS_OPTN_FLG"]?.ToString()?.Trim(),
                        CycleIntvl = partnerReader["CYCLE_INTVL"]?.ToString()?.Trim(),
                        CycleLstRunTs = partnerReader["CYCLE_LST_RUN_TS"]?.ToString()?.Trim(),
                        BatchSplitCnt = partnerReader["BATCH_SPLIT_CNT"]?.ToString()?.Trim(),
                        CycStrtTm = partnerReader["CYC_STRT_TM"]?.ToString()?.Trim(),
                        CycEndTm = partnerReader["CYC_END_TM"]?.ToString()?.Trim(),
                        OvrdApplBatchId = partnerReader["OVRD_APPL_BATCH_ID"]?.ToString()?.Trim(),
                        TransAuthId = partnerReader["TRANS_AUTH_ID"]?.ToString()?.Trim(),
                        CorrelId = partnerReader["CORREL_ID"]?.ToString()?.Trim(),
                        PlanNam = partnerReader["PLAN_NAM"]?.ToString()?.Trim(),
                        OdsIsrtTs = partnerReader["ODS_ISRT_TS"]?.ToString()?.Trim(),
                        OdsUpdTs = partnerReader["ODS_UPD_TS"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> ODS PARTNER SETUP ERROR: {ex.Message}");
                throw;
            }

            Console.WriteLine($">>> ODS IE_PARTNER_SETUP ROW COUNT: {response.PartnerSetup.Count}");
            string inPoSwQuery = @"
                SELECT
                    CO_CD,
                    PARTNER_ID,
                    SKIP_FR_TM,
                    SKIP_TO_TM,
                    CUST_PRTY,
                    ACK_PO_FLG,
                    ACK_PROMO_FLG,
                    BASERATE_FLG,
                    AGG_CD_CPBL_FLG,
                    PRE_IM_HOLD_FLG,
                    MULT_SHP_TO_FLG,
                    SYSTEM_PARTS_FLG,
                    VOID_TAXABLE_FLG,
                    CASEPACK_MSG_FLG,
                    CHK_CUST_PRC_FLG,
                    DIST_DEPTH_FLG,
                    AIR_BR_SEQ_FLG,
                    BR_SEQ_ORIDE_FLG,
                    MULT_BR_SEQ_FLG,
                    EXPORT_BR_SEQ_FLG,
                    HOLD_ORDER_FLG,
                    DFLT_CUST_NBR,
                    PROMO_CUST_NBR,
                    PRICE_CUST_NBR,
                    INST_REBAT_MSG_FLG,
                    VLA_FLG,
                    MULTI_DIST_FLG,
                    SAVE_FRT_FLG,
                    SAVE_DIST_FLG,
                    BEST_WHSE_FLG,
                    SINGLE_WHSE_FLG,
                    PRNT_ORDR_FLG,
                    MULT_SHP_SORT_SEQ,
                    MAX_FUT_DAY,
                    LST_CHG_TS,
                    LST_CHG_NAM,
                    CLS_X_FLTR_TYP_CD,
                    CLS_S_FLTR_TYP_CD,
                    UPD_CUST_SKU_FLG,
                    SAVE_CUST_PRC_FLG,
                    BO_BR_XFER_FLG,
                    REJ_ORDR_HDR_FLG,
                    REJ_CNSCMP_HDR_FLG,
                    ACK_RPT_FLG,
                    SPEC_PRC_FLG,
                    EU_CAPTURE_FLG,
                    CUSTOM_CARR_FLG,
                    CASCADE_SKU_FLG,
                    AUTO_PO_CHG_FLG,
                    CLS_X_HLD_FLG,
                    ST_STORE_OVRRD_FLG,
                    RSRV_CUST_NBR,
                    RSRV_ALLOWED,
                    RSRV_EXPIR_DAYS,
                    CONFIG_VISIBLE_FLG,
                    ETA_CALC_FLG,
                    ETA_DAYS,
                    ADDR_VALID_FLG,
                    AUTO_SPLIT_FLG,
                    ORDR_CANC_DAYS_FLG,
                    ORDR_CANC_DAYS_NBR,
                    FUT_ORDR_SW,
                    ACK_DELAY_SW,
                    ACK_DELAY_HRS,
                    TRANS_AUTH_ID
                FROM ODS.DB2_IE_IN_PO_SW
                WHERE CO_CD = :companyCode
                AND TRIM(PARTNER_ID) = :partnerid";

            //WHERE TRIM(CO_CD) = :companyCode
            //	AND TRIM(PARTNER_ID) = :partnerId";

            // Use the CO_CD / PARTNER_ID that were actually resolved from the Partner Setup lookup,
            // since that is the key confirmed to exist for this partner in ODS.
            // reuse the already-mapped CO_CD (MD->US, FT->CA)

            //string inPoSwPartnerId = "470887";

            try
            {
                await using OracleCommand inPoSwCmd = new OracleCommand(inPoSwQuery, conn);
                inPoSwCmd.BindByName = true;

                inPoSwCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = partnerCoCd;
                inPoSwCmd.Parameters.Add("partnerid", OracleDbType.Varchar2).Value = response.EoPartnerId?.Trim();
                //inPoSwCmd.Parameters.Add("partnerId", OracleDbType.Varchar2).Value = "470887";

                Console.WriteLine($">>> EXECUTING ODS IE_IN_PO_SW QUERY...");
                Console.WriteLine($">>> IE_IN_PO_SW CO_CD PARAMETER: {response.CustCoCd?.Trim()}");
                Console.WriteLine($">>> IE_IN_PO_SW PARTNER_ID PARAMETER: {response.EoPartnerId?.Trim()}");

                await using OracleDataReader inPoSwReader = await inPoSwCmd.ExecuteReaderAsync();

                Console.WriteLine($">>> ODS IE_IN_PO_SW READER HAS ROWS: {inPoSwReader.HasRows}");

                if (await inPoSwReader.ReadAsync())
                {
                    response.InPoSw.Add(new OrderInPoSw
                    {
                        CoCd = inPoSwReader["CO_CD"]?.ToString()?.Trim(),
                        PartnerId = inPoSwReader["PARTNER_ID"]?.ToString()?.Trim(),
                        SkipFrTm = inPoSwReader["SKIP_FR_TM"]?.ToString()?.Trim(),
                        SkipToTm = inPoSwReader["SKIP_TO_TM"]?.ToString()?.Trim(),
                        CustPrty = inPoSwReader["CUST_PRTY"]?.ToString()?.Trim(),
                        AckPoFlg = inPoSwReader["ACK_PO_FLG"]?.ToString()?.Trim(),
                        AckPromoFlg = inPoSwReader["ACK_PROMO_FLG"]?.ToString()?.Trim(),
                        BaserateFlg = inPoSwReader["BASERATE_FLG"]?.ToString()?.Trim(),
                        AggCdCpblFlg = inPoSwReader["AGG_CD_CPBL_FLG"]?.ToString()?.Trim(),
                        PreImHoldFlg = inPoSwReader["PRE_IM_HOLD_FLG"]?.ToString()?.Trim(),
                        MultShpToFlg = inPoSwReader["MULT_SHP_TO_FLG"]?.ToString()?.Trim(),
                        SystemPartsFlg = inPoSwReader["SYSTEM_PARTS_FLG"]?.ToString()?.Trim(),
                        VoidTaxableFlg = inPoSwReader["VOID_TAXABLE_FLG"]?.ToString()?.Trim(),
                        CasepackMsgFlg = inPoSwReader["CASEPACK_MSG_FLG"]?.ToString()?.Trim(),
                        ChkCustPrcFlg = inPoSwReader["CHK_CUST_PRC_FLG"]?.ToString()?.Trim(),
                        DistDepthFlg = inPoSwReader["DIST_DEPTH_FLG"]?.ToString()?.Trim(),
                        AirBrSeqFlg = inPoSwReader["AIR_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        BrSeqOrideFlg = inPoSwReader["BR_SEQ_ORIDE_FLG"]?.ToString()?.Trim(),
                        MultBrSeqFlg = inPoSwReader["MULT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        ExportBrSeqFlg = inPoSwReader["EXPORT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        HoldOrderFlg = inPoSwReader["HOLD_ORDER_FLG"]?.ToString()?.Trim(),
                        DfltCustNbr = inPoSwReader["DFLT_CUST_NBR"]?.ToString()?.Trim(),
                        PromoCustNbr = inPoSwReader["PROMO_CUST_NBR"]?.ToString()?.Trim(),
                        PriceCustNbr = inPoSwReader["PRICE_CUST_NBR"]?.ToString()?.Trim(),
                        InstRebatMsgFlg = inPoSwReader["INST_REBAT_MSG_FLG"]?.ToString()?.Trim(),
                        VlaFlg = inPoSwReader["VLA_FLG"]?.ToString()?.Trim(),
                        MultiDistFlg = inPoSwReader["MULTI_DIST_FLG"]?.ToString()?.Trim(),
                        SaveFrtFlg = inPoSwReader["SAVE_FRT_FLG"]?.ToString()?.Trim(),
                        SaveDistFlg = inPoSwReader["SAVE_DIST_FLG"]?.ToString()?.Trim(),
                        BestWhseFlg = inPoSwReader["BEST_WHSE_FLG"]?.ToString()?.Trim(),
                        SingleWhseFlg = inPoSwReader["SINGLE_WHSE_FLG"]?.ToString()?.Trim(),
                        PrntOrdrFlg = inPoSwReader["PRNT_ORDR_FLG"]?.ToString()?.Trim(),
                        MultShpSortSeq = inPoSwReader["MULT_SHP_SORT_SEQ"]?.ToString()?.Trim(),
                        MaxFutDay = inPoSwReader["MAX_FUT_DAY"]?.ToString()?.Trim(),
                        LstChgTs = inPoSwReader["LST_CHG_TS"]?.ToString()?.Trim(),
                        LstChgNam = inPoSwReader["LST_CHG_NAM"]?.ToString()?.Trim(),
                        ClsXFltrTypCd = inPoSwReader["CLS_X_FLTR_TYP_CD"]?.ToString()?.Trim(),
                        ClsSFltrTypCd = inPoSwReader["CLS_S_FLTR_TYP_CD"]?.ToString()?.Trim(),
                        UpdCustSkuFlg = inPoSwReader["UPD_CUST_SKU_FLG"]?.ToString()?.Trim(),
                        SaveCustPrcFlg = inPoSwReader["SAVE_CUST_PRC_FLG"]?.ToString()?.Trim(),
                        BoBrXferFlg = inPoSwReader["BO_BR_XFER_FLG"]?.ToString()?.Trim(),
                        RejOrdrHdrFlg = inPoSwReader["REJ_ORDR_HDR_FLG"]?.ToString()?.Trim(),
                        RejCnsCmpHdrFlg = inPoSwReader["REJ_CNSCMP_HDR_FLG"]?.ToString()?.Trim(),
                        AckRptFlg = inPoSwReader["ACK_RPT_FLG"]?.ToString()?.Trim(),
                        SpecPrcFlg = inPoSwReader["SPEC_PRC_FLG"]?.ToString()?.Trim(),
                        EuCaptureFlg = inPoSwReader["EU_CAPTURE_FLG"]?.ToString()?.Trim(),
                        CustomCarrFlg = inPoSwReader["CUSTOM_CARR_FLG"]?.ToString()?.Trim(),
                        CascadeSkuFlg = inPoSwReader["CASCADE_SKU_FLG"]?.ToString()?.Trim(),
                        AutoPoChgFlg = inPoSwReader["AUTO_PO_CHG_FLG"]?.ToString()?.Trim(),
                        ClsXHldFlg = inPoSwReader["CLS_X_HLD_FLG"]?.ToString()?.Trim(),
                        StStoreOvrRdFlg = inPoSwReader["ST_STORE_OVRRD_FLG"]?.ToString()?.Trim(),
                        RsrvCustNbr = inPoSwReader["RSRV_CUST_NBR"]?.ToString()?.Trim(),
                        RsrvAllowed = inPoSwReader["RSRV_ALLOWED"]?.ToString()?.Trim(),
                        RsrvExpirDays = inPoSwReader["RSRV_EXPIR_DAYS"]?.ToString()?.Trim(),
                        ConfigVisibleFlg = inPoSwReader["CONFIG_VISIBLE_FLG"]?.ToString()?.Trim(),
                        EtaCalcFlg = inPoSwReader["ETA_CALC_FLG"]?.ToString()?.Trim(),
                        EtaDays = inPoSwReader["ETA_DAYS"]?.ToString()?.Trim(),
                        AddrValidFlg = inPoSwReader["ADDR_VALID_FLG"]?.ToString()?.Trim(),
                        AutoSplitFlg = inPoSwReader["AUTO_SPLIT_FLG"]?.ToString()?.Trim(),
                        OrdrCancDaysFlg = inPoSwReader["ORDR_CANC_DAYS_FLG"]?.ToString()?.Trim(),
                        OrdrCancDaysNbr = inPoSwReader["ORDR_CANC_DAYS_NBR"]?.ToString()?.Trim(),
                        FutOrdrSw = inPoSwReader["FUT_ORDR_SW"]?.ToString()?.Trim(),
                        AckDelaySw = inPoSwReader["ACK_DELAY_SW"]?.ToString()?.Trim(),
                        AckDelayHrs = inPoSwReader["ACK_DELAY_HRS"]?.ToString()?.Trim(),
                        TransAuthId = inPoSwReader["TRANS_AUTH_ID"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> ODS IE_IN_PO_SW QUERY FAILED: {ex.Message}");
            }

            Console.WriteLine($">>> ODS IE_IN_PO_SW FOUND: {response.InPoSw.Count}");
            return response;
            // TRIM fixes trailing spaces in CHAR fixed-width columns
        }

        // Helper: safely converts DB2 numeric columns to decimal, defaulting to 0 if null/DBNull
        private static decimal ToDecimalSafe(object value)
        {
            if (value == null || value == DBNull.Value) return 0;
            return Convert.ToDecimal(value);
        }
    }
}