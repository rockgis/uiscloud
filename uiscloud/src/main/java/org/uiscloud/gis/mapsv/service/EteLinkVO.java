package org.uiscloud.gis.mapsv.service;

public class EteLinkVO {
	
	/** 일련번호 */
	private Integer gid;
	
	/** 상위국관리번호 */
	private String upStaMgno;
	
	/** 상위국이름 */
	private String upStaName;
	
	/** 상위국랙 */
	private Integer upStaRack;
	
	/** 상위국쉘프 */
	private Integer upStaShelf;
	
	/** 상위국포트 */
	private Integer upStaPort;
	
	/** 상위국코어 */
	private Integer frCaCore;
	
	/** 하위국관리번호 */
	private String toTp;
	
	/** 하위국이름 */
	private String toTpName;
	
	/** 하위국랙 */
	private Integer dnStaRack;
	
	/** 하위구궬프 */
	private Integer dnStaShelf;
	
	/** 하위국포트 */
	private Integer dnStaPort;
	
	/** 하위국코어 */
	private Integer toCaCore;
	
	/** 사용유무 */
	private String useYn;
	
	/** 최대 seq */
	private Integer maxSeq;

	public Integer getGid() {
		return gid;
	}

	public void setGid(Integer gid) {
		this.gid = gid;
	}

	public String getUpStaMgno() {
		return upStaMgno;
	}

	public void setUpStaMgno(String upStaMgno) {
		this.upStaMgno = upStaMgno;
	}

	public String getUpStaName() {
		return upStaName;
	}

	public void setUpStaName(String upStaName) {
		this.upStaName = upStaName;
	}

	public Integer getUpStaRack() {
		return upStaRack;
	}

	public void setUpStaRack(Integer upStaRack) {
		this.upStaRack = upStaRack;
	}

	public Integer getUpStaShelf() {
		return upStaShelf;
	}

	public void setUpStaShelf(Integer upStaShelf) {
		this.upStaShelf = upStaShelf;
	}

	public Integer getUpStaPort() {
		return upStaPort;
	}

	public void setUpStaPort(Integer upStaPort) {
		this.upStaPort = upStaPort;
	}

	public Integer getFrCaCore() {
		return frCaCore;
	}

	public void setFrCaCore(Integer frCaCore) {
		this.frCaCore = frCaCore;
	}

	public String getToTp() {
		return toTp;
	}

	public void setToTp(String toTp) {
		this.toTp = toTp;
	}

	public String getToTpName() {
		return toTpName;
	}

	public void setToTpName(String toTpName) {
		this.toTpName = toTpName;
	}

	public Integer getDnStaRack() {
		return dnStaRack;
	}

	public void setDnStaRack(Integer dnStaRack) {
		this.dnStaRack = dnStaRack;
	}

	public Integer getDnStaShelf() {
		return dnStaShelf;
	}

	public void setDnStaShelf(Integer dnStaShelf) {
		this.dnStaShelf = dnStaShelf;
	}

	public Integer getDnStaPort() {
		return dnStaPort;
	}

	public void setDnStaPort(Integer dnStaPort) {
		this.dnStaPort = dnStaPort;
	}

	public Integer getToCaCore() {
		return toCaCore;
	}

	public void setToCaCore(Integer toCaCore) {
		this.toCaCore = toCaCore;
	}

	public String getUseYn() {
		return useYn;
	}

	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}

	public Integer getMaxSeq() {
		return maxSeq;
	}

	public void setMaxSeq(Integer maxSeq) {
		this.maxSeq = maxSeq;
	}

}
