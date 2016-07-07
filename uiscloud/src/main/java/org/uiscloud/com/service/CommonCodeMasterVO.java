package org.uiscloud.com.service;

// 공통코드 Master
public class CommonCodeMasterVO {
	// 대분류코드
	private String codeType;
	// 코드
	private String code;
	// 코드명
	private String name;
	// 사용여부
	private String isUse;
	// 코드대분류 명칭
	private String codeTypeName;
	// 상위코드
	private String superCode;
	
	public CommonCodeMasterVO() {
		
	}

	public CommonCodeMasterVO(String codeType, String code, String name,
			String isUse, String codeTypeName, String superCode) {
		super();
		this.codeType = codeType;
		this.code = code;
		this.name = name;
		this.isUse = isUse;
		this.codeTypeName = codeTypeName;
		this.superCode = superCode;
	}

	public String getCodeType() {
		return codeType;
	}

	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIsUse() {
		return isUse;
	}

	public void setIsUse(String isUse) {
		this.isUse = isUse;
	}

	public String getCodeTypeName() {
		return codeTypeName;
	}

	public void setCodeTypeName(String codeTypeName) {
		this.codeTypeName = codeTypeName;
	}

	public String getSuperCode() {
		return superCode;
	}

	public void setSuperCode(String superCode) {
		this.superCode = superCode;
	}
}