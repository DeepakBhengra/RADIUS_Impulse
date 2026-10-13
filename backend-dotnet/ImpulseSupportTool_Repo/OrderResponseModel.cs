using System.Collections.Generic;

namespace ImpulseSupportTool_Repo
{
    public class OrderResponse
    {
        public string? CustCoCd { get; set; }
        public string? CustBr { get; set; }
        public string? ImiAsgdOrdrNbr { get; set; }
        public string? OrdrDt { get; set; }
        public string? CustPoNbr { get; set; }
        public string? BillToBranchNbr { get; set; }
        public string? BillToCustNbr { get; set; }
        public string? BillToSfx { get; set; }
        public string? ShipToSfx { get; set; }
        public string? CapsIdCd { get; set; }
        public string? Terms { get; set; }
        public string? ResdntlSw { get; set; }
        public string? OrdrStatus { get; set; }
        public string? OrdrCmpltFillSw { get; set; }
        public string? CrRels { get; set; }
        public string? EntyDt { get; set; }
        public string? TermId { get; set; }
        public string? OsSlsmn { get; set; }
        public string? IsSlsmn { get; set; }
        public string? PostalCd { get; set; }
        public string? EntyMthd { get; set; }
        public string? EdiCo { get; set; }
        public string? SplitSw { get; set; }
        public string? OrdRefNbr { get; set; }
        public string? FulmntSw { get; set; }
        public string? CrCrdSw { get; set; }
        public string? EntyTm { get; set; }
        public string? BidQotFlg { get; set; }
        public string? BidExpDt { get; set; }
        public string? OrdrCcyCd { get; set; }
        public decimal? CcyRate { get; set; }
        public string? PoCrtedSw { get; set; }
        public string? GovtBidFlg { get; set; }
        public string? EnhancedRmaSw { get; set; }
        public string? FlrngAuthActnCd { get; set; }
        public string? CuBusSgmt { get; set; }
        public string? CuBusTyp { get; set; }
        public string? CuaShipFrom { get; set; }
        public string? BaseRateOrdrSw { get; set; }
        public string? UserNam { get; set; }
        public string? GovtEndUserZip { get; set; }
        public string? BinTyp { get; set; }
        public string? GovtGsaInd { get; set; }
        public string? SplitBillToSw { get; set; }
        public string? GovtEndUserTyp { get; set; }
        public string? OdsLstUpdDt { get; set; }
        public string? EnhancedCrMemoSw { get; set; }
        public string? ImsDelFlg { get; set; }
        public string? SpecialHandleSw { get; set; }
        public string? CfgFlg { get; set; }
        public string? EndUserPoNbr { get; set; }
        public string? ResellerNbr { get; set; }
        public string? TnSpecCd { get; set; }
        public string? EndUserDataSw { get; set; }
        public string? EndUserAuthorization { get; set; }
        public string? EndUserAddrSuffix { get; set; }
        public string? EndUserVendorFlag { get; set; }
        public string? EndUserNbr { get; set; }
        public string? WasBord { get; set; }
        public string? JobAcctNbr { get; set; }
        public string? CapsBuyer { get; set; }
        public string? AckCode { get; set; }
        public string? CopyCode { get; set; }
        public string? ExtSoCode { get; set; }
        public string? TaxCode { get; set; }
        public string? StateCd { get; set; }
        public string? CountyCode { get; set; }
        public string? CityCode { get; set; }
        public decimal? TradeDisc { get; set; }
        public string? OrderManagementSw { get; set; }
        public string? SourceCode { get; set; }
        public string? SummInvoiceCode { get; set; }
        public string? CustType { get; set; }
        public string? CustRefNbr { get; set; }
        public decimal? OrderValueAtAdd { get; set; }
        public string? GwmdImagApplyFlag { get; set; }
        public string? CustomersLanguageCode { get; set; }
        public string? GlOffsetNbr { get; set; }
        public string? GlOffsetType { get; set; }
        public string? EndCustNum { get; set; }
        public string? FlrngAuthNbr { get; set; }
        public string? AllianceSw { get; set; }
        public string? CustRefNbr2 { get; set; }
        public string? Campaign { get; set; }
        public string? Contract { get; set; }
        public string? EndUserContSuffix { get; set; }
        public string? FreightForwarder { get; set; }
        public string? EndUserOrderSw { get; set; }
        public string? AodSw { get; set; }
        public string? CountryCode { get; set; }
        public string? SoldToSuffix { get; set; }
        public string? PayeeNbr { get; set; }
        public string? PayeeSuf { get; set; }
        public decimal? ResellerSplitPct { get; set; }
        public string? DeliveryTerms { get; set; }
        public string? EndCustId { get; set; }
        public string? VendorClaimNbr { get; set; }
        public string? IndiaGstOrderInd { get; set; }
        public string? LastDistNbr { get; set; }
        public string? LastShipmentNbr { get; set; }
        public string? PriorityCode { get; set; }
        public string? OutsourceSkuInd { get; set; }
        public string? DeleteTodaySw { get; set; }
        public string? PriceRecalcSw { get; set; }
        public string? EoPartnerId { get; set; }
        public string? EoStateCd { get; set; }
        public List<OrderLineItem> LineItems { get; set; } = new();
        public List<OrderStatusChange>? StatusChanges { get; set; } = new();
        public List<OrderPartnerSetup> PartnerSetup { get; set; } = new();
        public List<OrderInPoSw> InPoSw { get; set; } = new();
    }
    public class OrderLineItem
    {
        public string? CompanyCd { get; set; }
        public string? BranchNbr { get; set; }
        public string? OrdrNbr { get; set; }
        public string? DistNbr { get; set; }
        public string? ShipNbr { get; set; }
        public string? LineNbr { get; set; }
        public string? LineTyp { get; set; }
        public string? ImPartNbr { get; set; }
        public string? InvInd { get; set; }
        public string? LineStus { get; set; }
        public string? QtyOrded { get; set; }
        public string? QtyBord { get; set; }
        public string? QtyShpd { get; set; }
        public string? ColInd { get; set; }
        public string? McOrideSw { get; set; }
        public string? UnitPrc { get; set; }
        public string? UnitCost { get; set; }
        public string? UmOrideSw { get; set; }
        public string? UpOrideSw { get; set; }
        public string? UcOrideSw { get; set; }
        public string? VendNbr { get; set; }
        public string? InvUnitCost { get; set; }
        public string? Terms { get; set; }
        public string? TaxCd { get; set; }
        public string? PrmsDt { get; set; }
        public string? OsSlsmn { get; set; }
        public string? IsSlsmn { get; set; }
        public string? ItemTyp { get; set; }
        public string? Des { get; set; }
        public string? XtraDesSw { get; set; }
        public string? BordrSw { get; set; }
        public string? UnitWgt { get; set; }
        public string? SysCmpntSw { get; set; }
        public string? CompQtyPer { get; set; }
        public string? CnsgmInvSw { get; set; }
        public string? RollSw { get; set; }
        public string? EntyDt { get; set; }
        public string? MchgCd { get; set; }
        public string? CusOrigUnitPrc { get; set; }
        public string? SbstutCost { get; set; }
        public string? QtyBild { get; set; }
        public string? FrtInAmtBild { get; set; }
        public string? AdjdCostSw { get; set; }
        public string? FrtOutAmtBild { get; set; }
        public string? CancDt { get; set; }
        public string? RebatAmt { get; set; }
        public string? UpcNbr { get; set; }
        public string? CuaShipFrom { get; set; }
        public string? ItemCnsndSw { get; set; }
        public string? LstChgDt { get; set; }
        public string? AcopCostOrideInd { get; set; }
        public string? AcopRprcSw { get; set; }
        public string? MaqInd { get; set; }
        public string? VendPartNbr { get; set; }
        public string? OdsLstUpdDt { get; set; }
        public string? AdjCost { get; set; }
        public string? OrigAdjCost { get; set; }
        public string? SerialNbrAvailSw { get; set; }
        public string? CustItemNbr { get; set; }
        public string? CustLineNbr { get; set; }
        public string? ReserveTypeSw { get; set; }
        public string? BoEtaDate { get; set; }
        public string? SpecialSystemsCost { get; set; }
        public string? RetailPrice { get; set; }
        public string? ConvBasePrice { get; set; }
        public string? ConfigUnitPrice { get; set; }
        public string? ConfigInd { get; set; }
        public string? SystemItemLineNbr { get; set; }
        public string? Um { get; set; }
        public string? AggregateCode { get; set; }
        public string? ConfigAssemblyCd { get; set; }
        public string? ConfigurationLab { get; set; }
        public string? CatNbr { get; set; }
        public string? FreeItemSw { get; set; }
        public string? IcmsTaxAmt { get; set; }
        public string? IpiIssTaxSw { get; set; }
        public string? IpiIssTaxAmt { get; set; }
        public string? LastChgOpid { get; set; }
        public string? LastChgTime { get; set; }
        public string? PcTaxAmt { get; set; }
        public string? RelatedGovtBidVsn { get; set; }
        public string? ReserveSeqNbr { get; set; }
        public string? UnitPriceReseller { get; set; }
        public string? OrlForeignUnitPrice { get; set; }
        public string? OrlActualExchgRate { get; set; }
        public string? OrlVdrExchgRate { get; set; }
        public string? ConfigId { get; set; }
        public string? RelatedGovtBidGsn { get; set; }
        public string? HoldCode { get; set; }
        public string? GovtBidBasedLineSw { get; set; }
        public string? CommodCode { get; set; }
        public string? RefdirOverrideText { get; set; }
        public string? AllocType { get; set; }
        public string? InvoiceBreakCode { get; set; }
        public string? EntryTime { get; set; }
        public string? IcmsCode { get; set; }
        public string? IcmsTaxRate { get; set; }
        public string? IpiIssTaxRate { get; set; }
        public string? TesCode { get; set; }
        public string? AapBuildInd { get; set; }
        public string? AcopDeltaPrcInd { get; set; }
        public string? AcopEndUserNbr { get; set; }
        public string? AllocResvQty { get; set; }
        public string? AlncSw { get; set; }
        public string? AltUnitCost { get; set; }
        public string? AltWhseBr { get; set; }
        public string? AltWhseCcy { get; set; }
        public string? AltWhseCo { get; set; }
        public string? AsetTagSw { get; set; }
        public string? BaseUm { get; set; }
        public string? BaseUnit { get; set; }
        public string? BohUpdOnlineSw { get; set; }
        public string? CfgInd { get; set; }
        public string? CfgLab { get; set; }
        public string? CfscmpSysItemCo { get; set; }
        public string? CfscmpSysItemNbr { get; set; }
        public string? CntryOfOrig { get; set; }
        public string? CoopFlg { get; set; }
        public string? DiscCd { get; set; }
        public string? DiscPct { get; set; }
        public string? ExpLicence { get; set; }
        public string? FrgnUnitPrcSemi { get; set; }
        public string? InStkBr { get; set; }
        public string? InStkOth { get; set; }
        public string? KeyBr { get; set; }
        public string? KeyCo { get; set; }
        public string? LsbQtyAvail { get; set; }
        public string? Lsb { get; set; }
        public string? NonStdConvSw { get; set; }
        public string? OssNo { get; set; }
        public string? PgmTyp1 { get; set; }
        public string? PgmTyp2 { get; set; }
        public string? PromoCd { get; set; }
        public string? RefdirOvrdTyp { get; set; }
        public string? ReqPrftPct { get; set; }
        public string? RmaOvergoodsCd { get; set; }
        public string? RvsAcopInd { get; set; }
        public string? SemiCnducSw { get; set; }
        public string? ShtInd { get; set; }
        public string? SlsTypSw { get; set; }
        public string? SpecCompInd { get; set; }
        public string? SplitBillToSuff { get; set; }
        public string? TrToBrNbr { get; set; }
        public string? TrToDistNbr { get; set; }
        public string? TrToOrdrNbr { get; set; }
        public string? TrToShipNbr { get; set; }
        public string? TradeDisc { get; set; }
        public string? TxblItemSw { get; set; }
        public string? UsysContAcopInd { get; set; }
        public string? VatTaxCd { get; set; }
        public string? VatTaxRt { get; set; }
        public string? VdrExchgRtTyp { get; set; }
        public string? WgtPer { get; set; }
        public string? RmaRecvToday { get; set; }
        public string? RmaQtyOpen { get; set; }
        public string? FaastSapInvcNbr { get; set; }
        public string? OrdrDt { get; set; }
        public string? ImsDelFlg { get; set; }
        public string? SysItemLineNbr { get; set; }
        public string? AggrCd { get; internal set; }
        public string? ConfigAsmbyCd { get; internal set; }
        public string? LastChgTm { get; internal set; }
        public string? RelGovtBidVsn { get; internal set; }
        public string? ResvSeqNbr { get; internal set; }
        public string? UnitPriceRslr { get; internal set; }
        public string? ForeignUnitPrice { get; internal set; }
        public string? ActualExchgRate { get; internal set; }
        public string? VdrExchgRate { get; internal set; }
        public string? InvBrNbr { get; internal set; }
        public string? CommodCd { get; internal set; }
        public string? InvcCoCd { get; internal set; }
        public string? InvcBrNbr { get; internal set; }
        public string? InvcOrdrNbr { get; internal set; }
        public string? InvcInvcDt { get; internal set; }
        public string? InvcDistNbr { get; internal set; }
        public string? InvcShipNbr { get; internal set; }
        public string? OdsIsrtTs { get; internal set; }
        public string? EntyTm { get; internal set; }
    }

    public class OrderStatusChange
    {
        public string CoCd { get; set; }
        public string OrdrBrNbr { get; set; }
        public string OrdrNbr { get; set; }
        public string DistNbr { get; set; }
        public string ShipNbr { get; set; }
        public string OrdrDt { get; set; }
        public string StusChgTypCd { get; set; }
        public string StusChgTs { get; set; }
        public string OrdrLineNbr { get; set; }
        public string CustBrNbr { get; set; }
        public string CustNbr { get; set; }
        public string WebProcsFlg { get; set; }
        public string TomcatProcsFlg { get; set; }
        public string OrdrChgStusCd { get; set; }
        public string ConfigStusCd { get; set; }
        public string AggregateId { get; set; }
        public string PrmsChgDt { get; set; }
        public string FamilyCd { get; set; }
        public string LstChgProgNam { get; set; }
        public string LstChgOperId { get; set; }
        public string UpdtRsnTxt { get; set; }
        public string EvntRsnCd { get; set; }
        public decimal FlrDnlQty { get; set; }
        public string LastChgApplId { get; set; }
        public string TransAuthId { get; set; }
        public string CorrelId { get; set; }
        public string PlanNam { get; set; }
        public string OdsIsrtTs { get; set; }
        public string OdsUpdTs { get; set; }

    }
    public class OrderPartnerSetup
    {
        public string CoCd { get; set; }
        public string PartnerId { get; set; }
        public string PartnerTypeCd { get; set; }
        public string SrceSysId { get; set; }
        public string SrceSysKeyId { get; set; }
        public string FormatId { get; set; }
        public string DirFlgCd { get; set; }
        public string DocId { get; set; }
        public string FreqId { get; set; }
        public string DataStoreMechId { get; set; }
        public string CommuId { get; set; }
        public string InternetAddrTxt { get; set; }
        public string ActvDt { get; set; }
        public string DeactvDt { get; set; }
        public string HoldCd { get; set; }
        public string SetupNotesTxt { get; set; }
        public string SendThruId { get; set; }
        public string LstChgTs { get; set; }
        public string LstChgNam { get; set; }
        public string PrcsOptnFlg { get; set; }
        public string CycleIntvl { get; set; }
        public string CycleLstRunTs { get; set; }
        public string BatchSplitCnt { get; set; }
        public string CycStrtTm { get; set; }

        // Additional columns
        public string CycEndTm { get; set; }
        public string OvrdApplBatchId { get; set; }
        public string TransAuthId { get; set; }
        public string CorrelId { get; set; }
        public string PlanNam { get; set; }
        public string OdsIsrtTs { get; set; }
        public string OdsUpdTs { get; set; }
    }
    public class OrderInPoSw
    {
        public string CoCd { get; set; }
        public string PartnerId { get; set; }
        public string SkipFrTm { get; set; }
        public string SkipToTm { get; set; }
        public string CustPrty { get; set; }
        public string AckPoFlg { get; set; }
        public string AckPromoFlg { get; set; }
        public string BaserateFlg { get; set; }
        public string AggCdCpblFlg { get; set; }
        public string PreImHoldFlg { get; set; }
        public string MultShpToFlg { get; set; }
        public string SystemPartsFlg { get; set; }
        public string VoidTaxableFlg { get; set; }
        public string CasepackMsgFlg { get; set; }
        public string ChkCustPrcFlg { get; set; }
        public string DistDepthFlg { get; set; }
        public string AirBrSeqFlg { get; set; }
        public string BrSeqOrideFlg { get; set; }
        public string MultBrSeqFlg { get; set; }
        public string ExportBrSeqFlg { get; set; }
        public string HoldOrderFlg { get; set; }
        public string DfltCustNbr { get; set; }
        public string PromoCustNbr { get; set; }
        public string PriceCustNbr { get; set; }
        public string InstRebatMsgFlg { get; set; }
        public string VlaFlg { get; set; }
        public string MultiDistFlg { get; set; }
        public string SaveFrtFlg { get; set; }
        public string SaveDistFlg { get; set; }
        public string BestWhseFlg { get; set; }
        public string SingleWhseFlg { get; set; }
        public string PrntOrdrFlg { get; set; }
        public string MultShpSortSeq { get; set; }
        public string MaxFutDay { get; set; }
        public string LstChgTs { get; set; }
        public string LstChgNam { get; set; }
        public string ClsXFltrTypCd { get; set; }
        public string ClsSFltrTypCd { get; set; }
        public string UpdCustSkuFlg { get; set; }
        public string SaveCustPrcFlg { get; set; }
        public string BoBrXferFlg { get; set; }
        public string RejOrdrHdrFlg { get; set; }
        public string RejCnsCmpHdrFlg { get; set; }
        public string AckRptFlg { get; set; }
        public string SpecPrcFlg { get; set; }
        public string EuCaptureFlg { get; set; }
        public string CustomCarrFlg { get; set; }
        public string CascadeSkuFlg { get; set; }
        public string AutoPoChgFlg { get; set; }
        public string ClsXHldFlg { get; set; }
        public string StStoreOvrRdFlg { get; set; }
        public string RsrvCustNbr { get; set; }
        public string RsrvAllowed { get; set; }
        public string RsrvExpirDays { get; set; }
        public string ConfigVisibleFlg { get; set; }
        public string EtaCalcFlg { get; set; }
        public string EtaDays { get; set; }
        public string AddrValidFlg { get; set; }
        public string AutoSplitFlg { get; set; }
        public string OrdrCancDaysFlg { get; set; }
        public string OrdrCancDaysNbr { get; set; }
        public string FutOrdrSw { get; set; }
        public string AckDelaySw { get; set; }
        public string AckDelayHrs { get; set; }
        public string TransAuthId { get; set; }

    }

}