package org.uiscloud.gis.interactiveUi.service;

public class InteractiveVO {

	//노드
	private String nodeId;
	private String tpoName;
	private String tpoCode;
	private String jpName;
	private String jpCode;
	private String clientCd;

	//엣지
	private String source;
	private String target;
	private String sysClf;
	private Integer sumCoreCnt;
	private Integer sumUseCoreCnt;
	private Integer countCable;
	
	
	public InteractiveVO() {
		
	}

	public InteractiveVO(String nodeId,String tpoName,String tpoCode,String jpName,String jpCode, String clientCd,
			String source,String target,String sysClf,Integer sumCoreCnt,Integer sumUseCoreCnt,Integer countCable) {
		super();
		this.nodeId = nodeId;
		this.tpoName = tpoName;
		this.tpoCode = tpoCode;
		this.jpName = jpName;
		this.jpCode = jpCode;
		this.clientCd = clientCd;
		
		this.source = source;
		this.target = target;
		this.sumCoreCnt = sumCoreCnt;
		this.sumUseCoreCnt = sumUseCoreCnt;
		this.countCable = countCable;
	}
	
	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getTpoName() {
		return tpoName;
	}

	public void setTpoName(String tpoName) {
		this.tpoName = tpoName;
	}

	public String getTpoCode() {
		return tpoCode;
	}

	public void setTpoCode(String tpoCode) {
		this.tpoCode = tpoCode;
	}

	public String getJpName() {
		return jpName;
	}

	public void setJpName(String jpName) {
		this.jpName = jpName;
	}

	public String getJpCode() {
		return jpCode;
	}

	public void setJpCode(String jpCode) {
		this.jpCode = jpCode;
	}
	
	public String getClientCd() {
		return clientCd;
	}

	public void setClientCd(String clientCd) {
		this.clientCd = clientCd;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public String getSysClf() {
		return sysClf;
	}

	public void setSysClf(String sysClf) {
		this.sysClf = sysClf;
	}

	public Integer getSumCoreCnt() {
		return sumCoreCnt;
	}

	public void setSumCoreCnt(Integer sumCoreCnt) {
		this.sumCoreCnt = sumCoreCnt;
	}

	public Integer getSumUseCoreCnt() {
		return sumUseCoreCnt;
	}

	public void setSumUseCoreCnt(Integer sumUseCoreCnt) {
		this.sumUseCoreCnt = sumUseCoreCnt;
	}

	public Integer getCountCable() {
		return countCable;
	}

	public void setCountCable(Integer countCable) {
		this.countCable = countCable;
	}

}