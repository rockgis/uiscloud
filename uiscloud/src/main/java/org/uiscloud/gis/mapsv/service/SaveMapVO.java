/**
 * 
 * @Class Name  : LayerTreeVO.java
 * @Description  : LayerTreeVO Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 12. 02.  최원석		최초생성
 * 
 * @author 김종민
 * @since 2013. 12. 02.
 * @version 1.1
 * @see
 * 
 * 화면저장 Value Object
 *
 */
package org.uiscloud.gis.mapsv.service;


public class SaveMapVO {

	/** 너비 */
	private int width;
	
	/** 높이 */
	private int height;
	
	/** 해상도 */
	private double resolution;
	
	/** 화면영역의 왼쪽 좌표 (xMin) */
	private double left;
	
	/** 화면영역의 아래쪽 좌표 (yMin) */
	private double bottom;
	
	/** 화면영역의 오른쪽 좌표 (yMax) */
	private double right;
	
	/** 화면영역의 위쪽 좌표 (yMax) */
	private double top;
	
	/** 현재 구동 서버 주소 ex)http://127.0.0.1:8080 */
	private String rootContext;

	public int getWidth() {
		return width;
	}

	public void setWidth(final int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(final int height) {
		this.height = height;
	}

	public double getResolution() {
		return resolution;
	}

	public void setResolution(final double resolution) {
		this.resolution = resolution;
	}

	public double getLeft() {
		return left;
	}

	public void setLeft(final double left) {
		this.left = left;
	}

	public double getBottom() {
		return bottom;
	}

	public void setBottom(final double bottom) {
		this.bottom = bottom;
	}

	public double getRight() {
		return right;
	}

	public void setRight(final double right) {
		this.right = right;
	}

	public double getTop() {
		return top;
	}

	public void setTop(final double top) {
		this.top = top;
	}

	public String getRootContext() {
		return rootContext;
	}

	public void setRootContext(final String rootContext) {
		this.rootContext = rootContext;
	}
	
}
