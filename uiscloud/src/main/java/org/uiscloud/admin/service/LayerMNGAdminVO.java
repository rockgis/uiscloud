package org.uiscloud.admin.service;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;

public class LayerMNGAdminVO {
	/** PK */
	@NotEmpty(message = "레이어 트리 기본키를 입력하세요.")
	private int layerTreePk;
	
	private String groupName;
	
	/** 한글명 */
	@NotEmpty(message = "레이어 한글명을 입력하세요.")
	@Length(min=2, message="레이어 한글명을 2자 이상 입력하세요.")
	@SafeHtml(message="안전하지 않은 태그를 포함할 수 없습니다.")
	private String korName;
	
	/** 레이어명 */
	@SafeHtml(message="안전하지 않은 태그를 포함할 수 없습니다.")
	private String layerName;

	/** 심볼라이저 */
	private String symbolizer;

	/** 대상 테이블 */
	private String tableName;

	/** 검색 조건 필드 */
	private String conditionField;

	/** 검색 조건 */
	private String condition;
	
	/** 아이콘 클래스 */
	private String iconCls;
	
	/** 사용 여부 */
	private boolean used;

	/** 부모 트리 PK */
	@NotEmpty(message = "부모 트리 노드의 기본키를 입력하세요.")
	private int parentPk;
	
	/** 트리 순서 */
	@NotEmpty(message = "트리 순서를 숫자로 입력하세요.")
	private int treeOrder;
	
	/** 트리 깊이 */
	@NotEmpty(message = "트리 깊이를 숫자로 입력하세요.")
	private int treeDepth;
	
	/** Display Level  */
	@NotEmpty(message = "Display Level 을 선택하세요..")
	private int displayLevel;
	
	/** 하위 Open 여부  */
	@NotEmpty(message = "하위 트리 Open 여부를 입력하세요.")
	private boolean opened;

	/** 처음 로딩시에 Check 선택 여부 */
	@NotEmpty(message = "트리 Checked 여부를 입력하세요.")
	private boolean checked;
	
	/** 검색 필수 필드 조건 */
	private Integer searchRequiredFieldsType;
	
	public LayerMNGAdminVO() {
		super();
	}
	
	public LayerMNGAdminVO(int categoryCode, String groupName, String korName, String layerName, 
			String symbolizer, String tableName, String conditionField, String condition, String iconCls,
			int parentPk, int treeOrder, int treeDepth, int displayLevel, boolean opened, boolean checked, Integer searchRequiredFieldsType) {
		super();
		this.groupName = groupName;
		this.korName = korName;
		this.layerName = layerName;
		this.symbolizer = symbolizer;
		this.tableName = tableName;
		this.conditionField = conditionField;
		this.condition = condition;
		this.iconCls = iconCls;
		this.parentPk = parentPk;
		this.treeOrder = treeOrder;
		this.treeDepth = treeDepth;
		this.displayLevel = displayLevel;
		this.opened = opened;
		this.checked = checked;
		this.searchRequiredFieldsType = searchRequiredFieldsType;
	}
	
	public int getLayerTreePk() {
		return layerTreePk;
	}
	
	public void setLayerTreePk(int layerTreePk) {
		this.layerTreePk = layerTreePk;
	}
	
	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getKorName() {
		return korName;
	}
	
	public void setKorName(String korName) {
		this.korName = korName;
	}
	
	public String getLayerName() {
		if(layerName == null) {
			return "";
		} else {
			return layerName;
		}
	}
	
	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}
	
	public String getSymbolizer() {
		if(symbolizer == null) {
			return "";
		} else {
			return symbolizer;
		}
	}
	
	public void setSymbolizer(String symbolizer) {
		this.symbolizer = symbolizer;
	}
	
	public String getTableName() {
		if(tableName == null) {
			return "";
		} else {
			return tableName;
		}
	}
	
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
	public String getConditionField() {
		if(conditionField == null) {
			return "";
		} else {
			return conditionField;
		}
	}
	
	public void setConditionField(String conditionField) {
		this.conditionField = conditionField;
	}
	
	public String getCondition() {
		if(condition == null) {
			return "";
		} else {
			return condition;
		}
	}
	
	public void setCondition(String condition) {
		this.condition = condition;
	}
	
	public String getIconCls() {
		if(iconCls == null) {
			return "";
		} else {
			return iconCls;
		}
	}
	
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public boolean isUsed() {
		return used;
	}

	public void setUsed(boolean used) {
		this.used = used;
	}
	
	public int getParentPk() {
		return parentPk;
	}
	
	public void setParentPk(int parentPk) {
		this.parentPk = parentPk;
	}
	
	public int getTreeOrder() {
		return treeOrder;
	}
	
	public void setTreeOrder(int treeOrder) {
		this.treeOrder = treeOrder;
	}
	
	public int getTreeDepth() {
		return treeDepth;
	}
	
	public void setTreeDepth(int treeDepth) {
		this.treeDepth = treeDepth;
	}
	
	public int getDisplayLevel() {
		return displayLevel;
	}
	
	public void setDisplayLevel(int displayLevel) {
		this.displayLevel = displayLevel;
	}

	public boolean isOpened() {
		return opened;
	}

	public void setOpened(boolean opened) {
		this.opened = opened;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public Integer getSearchRequiredFieldsType() {
		return searchRequiredFieldsType;
	}

	public void setSearchRequiredFieldsType(Integer searchRequiredFieldsType) {
		this.searchRequiredFieldsType = searchRequiredFieldsType;
	}
	
	public Integer[] getLayerTreePkAndSearchRequiredFieldsType() {
		Integer[] arr = new Integer[2];
		
		arr[0] = this.layerTreePk;
		arr[1] = this.searchRequiredFieldsType;
		
		return arr;
	}
	
	public String getKorNameForLayerTree() {
		String korNameForLayerTree = korName;
		
		if(displayLevel > 0) {
			korNameForLayerTree = korName + " (" + displayLevel + " 레벨)";
		}
		
		return korNameForLayerTree;
	}
}