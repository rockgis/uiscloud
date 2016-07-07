package org.uiscloud.gis.mapInfo.service;

import java.sql.Date;

public class MapInfoCaSearchVO extends MapInfoSearchVO {
	private String[] ungrLoc; 				// 매설위치
	private Double compLenMin; 				// 포설거리
	private Double compLenMax; 				// 포설거리
	private Double gisLenMin; 				// 지도거리
	private Double gisLenMax; 				// 지도거리
	private Double coreCntMin; 				// 코아수
	private Double coreCntMax; 				// 코아수
	private Double useCoreCntMin; 			// 사용코아수
	private Double useCoreCntMax; 			// 사용코아수
	private Double connCoreCntMin; 			// 접속코아수
	private Double connCoreCntMax; 			// 접속코아수
	private Date compDtStartDate; 		// 설치일자
	private Date compDtFinishDate; 		// 설치일자
	private String workDocNo; 				// 작업지시번호
	private String caMnftNo; 				// 케이블 제조번호
	private String[] netClf; 				// 망 분류 
	private String[] serviceType; 			// 서비스구분	
	private String[] useCoreGrade; 			// GIS 심벌 코드(수용률 기준)
	private Integer coreRemainingCntMin;  	// 잔여코아수
	private Integer coreRemainingCntMax;  	// 잔여코아수
	private String polygonWKT;				// 다각형 WKT
	
	@SuppressWarnings("unused")
	private MapInfoCaSearchVO() {
		super();
	}

	public MapInfoCaSearchVO(String fctsNm, String unqMgno,
			String cnstMgno, String[] sysClf, String lglCd, 
			String tableName, String[] gisCode, 
			String layerName, Integer page, Integer rows, Integer totalCount, 
			
			String ownClf,
			String[] ungrLoc, Double compLenMin, Double compLenMax,
			Double gisLenMin, Double gisLenMax, Double coreCntMin,
			Double coreCntMax, Double useCoreCntMin, Double useCoreCntMax,
			Double connCoreCntMin, Double connCoreCntMax,
			Date compDtStartDate, Date compDtFinishDate, String workDocNo,
			String caMnftNo, String[] netClf, String[] serviceType, String[] useCoreGrade,
			Integer coreRemainingCntMin, Integer coreRemainingCntMax, String polygonWKT) {
		super(fctsNm, unqMgno,
				cnstMgno, sysClf, lglCd, 
				tableName, gisCode, 
				layerName, page, rows, totalCount);
		this.ungrLoc = ungrLoc;
		this.compLenMin = compLenMin;
		this.compLenMax = compLenMax;
		this.gisLenMin = gisLenMin;
		this.gisLenMax = gisLenMax;
		this.coreCntMin = coreCntMin;
		this.coreCntMax = coreCntMax;
		this.useCoreCntMin = useCoreCntMin;
		this.useCoreCntMax = useCoreCntMax;
		this.connCoreCntMin = connCoreCntMin;
		this.connCoreCntMax = connCoreCntMax;
		this.compDtStartDate = compDtStartDate;
		this.compDtFinishDate = compDtFinishDate;
		this.workDocNo = workDocNo;
		this.caMnftNo = caMnftNo;
		this.netClf = netClf;
		this.serviceType = serviceType;
		this.useCoreGrade = useCoreGrade;
		this.coreRemainingCntMin = coreRemainingCntMin;
		this.coreRemainingCntMax = coreRemainingCntMax;
		this.polygonWKT = polygonWKT;
	};
	
	public String[] getUngrLoc() {
		return ungrLoc;
	}

	public void setUngrLoc(String[] ungrLoc) {
		this.ungrLoc = ungrLoc;
	}

	public Double getCompLenMin() {
		return compLenMin;
	}

	public void setCompLenMin(Double compLenMin) {
		this.compLenMin = compLenMin;
	}

	public Double getCompLenMax() {
		return compLenMax;
	}

	public void setCompLenMax(Double compLenMax) {
		this.compLenMax = compLenMax;
	}

	public Double getGisLenMin() {
		return gisLenMin;
	}

	public void setGisLenMin(Double gisLenMin) {
		this.gisLenMin = gisLenMin;
	}

	public Double getGisLenMax() {
		return gisLenMax;
	}

	public void setGisLenMax(Double gisLenMax) {
		this.gisLenMax = gisLenMax;
	}

	public Double getCoreCntMin() {
		return coreCntMin;
	}

	public void setCoreCntMin(Double coreCntMin) {
		this.coreCntMin = coreCntMin;
	}

	public Double getCoreCntMax() {
		return coreCntMax;
	}

	public void setCoreCntMax(Double coreCntMax) {
		this.coreCntMax = coreCntMax;
	}

	public Double getUseCoreCntMin() {
		return useCoreCntMin;
	}

	public void setUseCoreCntMin(Double useCoreCntMin) {
		this.useCoreCntMin = useCoreCntMin;
	}

	public Double getUseCoreCntMax() {
		return useCoreCntMax;
	}

	public void setUseCoreCntMax(Double useCoreCntMax) {
		this.useCoreCntMax = useCoreCntMax;
	}

	public Double getConnCoreCntMin() {
		return connCoreCntMin;
	}

	public void setConnCoreCntMin(Double connCoreCntMin) {
		this.connCoreCntMin = connCoreCntMin;
	}

	public Double getConnCoreCntMax() {
		return connCoreCntMax;
	}

	public void setConnCoreCntMax(Double connCoreCntMax) {
		this.connCoreCntMax = connCoreCntMax;
	}

	public Date getCompDtStartDate() {
		return compDtStartDate;
	}

	public void setCompDtStartDate(Date compDtStartDate) {
		this.compDtStartDate = compDtStartDate;
	}

	public Date getCompDtFinishDate() {
		return compDtFinishDate;
	}

	public void setCompDtFinishDate(Date compDtFinishDate) {
		this.compDtFinishDate = compDtFinishDate;
	}

	public String getWorkDocNo() {
		return workDocNo;
	}

	public void setWorkDocNo(String workDocNo) {
		this.workDocNo = workDocNo;
	}

	public String getCaMnftNo() {
		return caMnftNo;
	}

	public void setCaMnftNo(String caMnftNo) {
		this.caMnftNo = caMnftNo;
	}

	public String[] getNetClf() {
		return netClf;
	}

	public void setNetClf(String[] netClf) {
		this.netClf = netClf;
	}

	public String[] ServiceType() {
		return serviceType;
	}

	public void setServiceType(String[] serviceType) {
		this.serviceType = serviceType;
	}
	
	public String[] getUseCoreGrade() {
		return useCoreGrade;
	}

	public void setUseCoreGrade(String[] useCoreGrade) {
		this.useCoreGrade = useCoreGrade;
	}

	public Integer getCoreRemainingCntMin() {
		return coreRemainingCntMin;
	}

	public void setCoreRemainingCntMin(Integer coreRemainingCntMin) {
		this.coreRemainingCntMin = coreRemainingCntMin;
	}

	public Integer getCoreRemainingCntMax() {
		return coreRemainingCntMax;
	}

	public void setCoreRemainingCntMax(Integer coreRemainingCntMax) {
		this.coreRemainingCntMax = coreRemainingCntMax;
	}

	public String getPolygonWKT() {
		return polygonWKT;
	}

	public void setPolygonWKT(String polygonWKT) {
		this.polygonWKT = polygonWKT;
	}	
}