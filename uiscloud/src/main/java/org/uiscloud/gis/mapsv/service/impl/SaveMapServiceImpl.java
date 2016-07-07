/**
 * 
 * @Class Name  : SaveMapServiceImpl.java
 * @Description : 지도 화면 저장 이미지 생성
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 11. 21.  최원석		최초생성
 * 
 * @author 최원석
 * @since 2013. 11. 21.
 * @version 1.0
 * @see
 * 
 * 지도 화면 저장 이미지 Service Impl
 *
 */
package org.uiscloud.gis.mapsv.service.impl;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.RenderingHints;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapsv.service.SaveMapService;
import org.uiscloud.gis.mapsv.service.SaveMapVO;

/**
 * @Class Name : SaveMapServiceImpl.java
 * @Description : 지도 객체 이미지 관리 Service Class
 * @Modification Information 
 * @ 
 * @ 수정일 수정자 수정내용 @ 
 * @ ------------- ------------------------------------- 
 * @ 2013. 11. 17. NPIMSYJG 최초 생성
 * 
 * @author NPIMSYJG
 * @since 2013. 11. 17.
 * @version 1.0
 * @see SK BIES 시스템
 * 
 */
@Service("saveMapService")
public class SaveMapServiceImpl extends Component implements SaveMapService {

	private static final long serialVersionUID = 4265859784154839003L;
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/**
	 * 지도 객체 이미지 생성
	 * @param xmlStr 지도 정보(XML)
	 * @param rootContext 서버주소 (http, ip, port)
	 * @return 지도 이미지 반환
	 * @throws DocumentException
	 * @throws IOException
	 */
	@Override
	public BufferedImage createImages(String xmlStr, String rootContext) throws DocumentException, IOException {
		SaveMapVO vo = new SaveMapVO();
		vo.setRootContext(rootContext);

		SAXReader reader = new SAXReader();
		Document doc;
		doc = reader.read(IOUtils.toInputStream(xmlStr, "UTF-8"));
		Element root = doc.getRootElement();
		
		parseMap(root, vo);
		
		BufferedImage bi  = new BufferedImage(vo.getWidth(), vo.getHeight(), BufferedImage.TYPE_INT_ARGB);
		
		Graphics2D graphics = bi.createGraphics();
		graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		
		// 흰색 배경 설정
		graphics.setBackground(Color.white);
		graphics.fillRect(0, 0, vo.getWidth(), vo.getHeight());
		drawLayers(root, vo, graphics);
		drawPopups(root, vo, graphics);
		
		graphics.dispose();
		
		return bi;
	}
	
	/**
	 * 지도 객체 정보 분석
	 * @param root 루트 엘리먼트
	 * @param vo 저장객체
	 */
	private void parseMap(Element root, SaveMapVO vo) {
		Element map = root.element("MAP");
		
		vo.setWidth(Integer.parseInt(map.elementText("width")));
		vo.setHeight(Integer.parseInt(map.elementText("height")));
		vo.setResolution(Double.parseDouble(map.elementText("resolution")));
		vo.setLeft(Double.parseDouble(map.elementText("left")));
		vo.setBottom(Double.parseDouble(map.elementText("bottom")));
		vo.setRight(Double.parseDouble(map.elementText("right")));
		vo.setTop(Double.parseDouble(map.elementText("top")));
	}
	
	/**
	 * 레이어 그리기 
	 * @param root 루트 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 */
	@SuppressWarnings("unchecked")
	private void drawLayers(Element root, SaveMapVO vo, Graphics2D graphics) {
		MediaTracker tracker = new MediaTracker(this);
		List<Element> layers = root.elements("LAYER");
		for(Element layer : layers) {
			if(layer.attribute("type").getValue().equalsIgnoreCase("TMS")) {
				drawTMSLayer(layer, vo, graphics, tracker);
			}
			else if(layer.attribute("type").getValue().equalsIgnoreCase("WMS")) {
				drawWMSLayer(layer, vo, graphics, tracker);
			}
			else if(layer.attribute("type").getValue().equalsIgnoreCase("VECTOR")) {
				drawVectorLayer(layer, vo, graphics, tracker);				
			}
		}
	}
	
	/**
	 * 팝업 그리기
	 * @param root 루트 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 */
	@SuppressWarnings("unchecked")
	private void drawPopups(Element root, SaveMapVO vo, Graphics2D graphics) {
		List<Element> popups = root.elements("POPUP");
		for(Element popup : popups) {
			double lon = Double.parseDouble(popup.elementText("x"));
			double lat = Double.parseDouble(popup.elementText("y"));
			String contentHTML = popup.elementText("text");
			String fontFamily = popup.elementText("fontFamily");
			int fontSize = Integer.parseInt(popup.elementText("fontSize"));
			
			int x = (int)Math.round(1/vo.getResolution() * (lon - vo.getLeft()));
			int y = (int)Math.round(1/vo.getResolution() * (vo.getTop() - lat));
			
			int offsetX = Integer.parseInt(popup.elementText("offsetX"));
			int offsetY = Integer.parseInt(popup.elementText("offsetY"));
			x += offsetX;
			y += offsetY;
			
			int width = Integer.parseInt(popup.elementText("width"));
			int height = Integer.parseInt(popup.elementText("height"));
			
			contentHTML = contentHTML.replaceAll("\r\n", "\n");
			String[] strList = contentHTML.split("\n");
			
			int MaxSpaceCount = 0;
			for(int i=0; i < strList.length; i++) {
				String[] arrSpace = strList[i].split(" ");
				if(arrSpace.length > MaxSpaceCount) MaxSpaceCount = arrSpace.length;
			}
			
			width += Math.round(MaxSpaceCount * 0.2);
			
			String[] arrSpace = contentHTML.split(" ");
			
			if(fontFamily.equalsIgnoreCase("휴먼옛체")) {
				width += Math.round(arrSpace.length * 1);
			}
			else if(fontFamily.equalsIgnoreCase("신명조")) {
				width += width * -(arrSpace.length * 3);
			}
			else {
				width += Math.round(arrSpace.length * 0.2);
			}
			
			graphics.setStroke(new BasicStroke((float)1));
			graphics.setColor(new Color(255, 255, 255));
			
			String backgroundOpacity = popup.elementText("backgroundOpacity");
			if((!backgroundOpacity.equalsIgnoreCase("")) && (!backgroundOpacity.equalsIgnoreCase("undefined"))) {
				AlphaComposite alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(backgroundOpacity));
				graphics.setComposite(alpha);
			}
			else {
				graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
			}
			graphics.fillRect(x, y, width, height);
			
			graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
			graphics.setColor(new Color(204, 204, 204));
			graphics.drawRect(x, y, width, height);
			
			graphics.setFont(new Font(fontFamily, Font.PLAIN, fontSize));
			
			String rgb = popup.elementText("fontColor");
			int r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
			int g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
			int b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
			graphics.setColor(new Color(r, g, b));
			
			int leftBuffer = 4 + Math.round(fontSize/20);
			int bottomBuffer = 3 + Math.round(fontSize/5);
			
			for(int i=0; i < strList.length; i++) {
				int seq = strList.length-1 - i;
				graphics.drawString(strList[i], x+leftBuffer, Math.round(y+height-bottomBuffer-(seq*fontSize*1.2)));
			}
		}
	}
	
	/**
	 * TMS 레이어 그리기
	 * @param layer 레이어 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 * @param tracker 이미지트래커
	 */
	private void drawTMSLayer(Element layer, SaveMapVO vo, Graphics2D graphics, MediaTracker tracker) {
		String url = layer.elementText("url");
		double resolution = vo.getResolution();
		int tileSizeW = Integer.parseInt(layer.elementText("tileSizeW"));
		int tileSizeH = Integer.parseInt(layer.elementText("tileSizeH"));
		String extension = layer.elementText("extension");
		
		double maxLeft = Double.parseDouble(layer.elementText("maxLeft"));
		double maxBottom = Double.parseDouble(layer.elementText("maxBottom"));
		double maxRight = Double.parseDouble(layer.elementText("maxRight"));
		double maxTop = Double.parseDouble(layer.elementText("maxTop"));
		
		int scaleLevel = Integer.parseInt(layer.elementText("scaleLevel")); 
		
		int buffer = 1;

		int minRows = (int)(Math.ceil(vo.getWidth()/tileSizeW) + Math.max(1, 2 * buffer));
		int minCols = (int)(Math.ceil(vo.getWidth()/tileSizeH) + Math.max(1, 2 * buffer));
		
		double layoutTilelon = resolution * tileSizeW;
		double layoutTilelat = resolution * tileSizeH;
		
		double offsetlon = vo.getLeft() - maxLeft;
		int tilecol = (int) (Math.floor(offsetlon/layoutTilelon) - buffer);
		double tilecolremain = offsetlon/layoutTilelon - tilecol;
		double layoutTileoffsetx = -tilecolremain * tileSizeW;
		double layoutTileoffsetlon = maxLeft + tilecol * layoutTilelon;
		
		double offsetlat = vo.getTop() - (maxBottom + layoutTilelat);  
		int tilerow = (int) (Math.ceil(offsetlat/layoutTilelat) + buffer);
		double tilerowremain = tilerow - offsetlat/layoutTilelat;
		double layoutTileoffsety = -tilerowremain * tileSizeH;
		double layoutTileoffsetlat = maxBottom + tilerow * layoutTilelat;
		
		int tileoffsetx = (int) Math.round(layoutTileoffsetx); // heaven help us
		int tileoffsety = (int) Math.round(layoutTileoffsety);

		double tileoffsetlon = layoutTileoffsetlon;
		double tileoffsetlat = layoutTileoffsetlat;
        
		double tilelon = layoutTilelon;
		double tilelat = layoutTilelat;

        int startX = tileoffsetx; 
        double startLon = tileoffsetlon;

        double rowidx = 0;
        
        int layerContainerDivLeft = 0;
        int layerContainerDivTop = 0;

		do {
			rowidx++;
			tileoffsetlon = startLon;
			tileoffsetx = startX;
			int colidx = 0;

			do {
				double left = tileoffsetlon;
				double bottom = tileoffsetlat;

				int x = tileoffsetx;
				x -= layerContainerDivLeft;

				int y = tileoffsety;
				y -= layerContainerDivTop;

				colidx++;

				String tileUrl = getTMSXYZ(url, resolution, tileSizeW, tileSizeH, extension, left, bottom, maxLeft, maxBottom, maxRight, maxTop, scaleLevel);

				Image tileImg = null;
				try {
					tileImg = Toolkit.getDefaultToolkit().getImage(new URL(tileUrl));
					tracker.addImage(tileImg, 0);
					tracker.waitForAll();
				} catch (MalformedURLException e) {
					log.error("URL TMS");
				}catch (InterruptedException e) {
					log.error("Image Tracker");
				}
				graphics.drawImage(tileImg, x, y, tileSizeW, tileSizeH, null);

				tileoffsetlon += tilelon;
				tileoffsetx += tileSizeW;
			} while ((tileoffsetlon <= vo.getRight() + tilelon * buffer)
					|| colidx < minCols);
			tileoffsetlat -= tilelat;
			tileoffsety += tileSizeH;
		} while ((tileoffsetlat >= vo.getBottom() - tilelat * buffer)
				|| rowidx < minRows);
	}
	
	/**
	 * WMS 레이어 그리기
	 * @param layer 레이어 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 * @param tracker 이미지트래커
	 */
	private void drawWMSLayer(Element layer, SaveMapVO vo, Graphics2D graphics, MediaTracker tracker) {
		String url = layer.elementText("url");
		StringBuffer params = new StringBuffer();
		params.append("layers=");
		params.append(layer.elementText("layers"));
		params.append("&styles=");
		params.append(layer.elementText("styles"));
		params.append("&format=");
		params.append(layer.elementText("format"));
		params.append("&version=");
		params.append(layer.elementText("version"));
		params.append("&crs=");
		params.append(layer.elementText("crs"));
		params.append("&service=");
		params.append(layer.elementText("service"));
		params.append("&request=");
		params.append(layer.elementText("request"));
		params.append("&exceptions=");
		params.append(layer.elementText("exceptions"));
		params.append("&bbox=");
		params.append(vo.getBottom());
		params.append(",");
		params.append(vo.getLeft());
		params.append(",");
		params.append(vo.getTop());
		params.append(",");
		params.append(vo.getRight());
		params.append("&width=");
		params.append(vo.getWidth());
		params.append("&height=");
		params.append(vo.getHeight());
		params.append("&TRANSPARENT=true");
		try {
			Image wmsImg = Toolkit.getDefaultToolkit().getImage(new URL(url+"?"+params));
			tracker.addImage(wmsImg, 0);
			tracker.waitForAll();
			graphics.drawImage(wmsImg, 0, 0, vo.getWidth(), vo.getHeight(), null);
		}
		catch (MalformedURLException e) {
			log.error("URL TMS");
		}
		catch (InterruptedException e) {
			log.error("Image Tracker");
		}
	}
	
	/**
	 * 벡터 레이어 그리기
	 * @param layer 레이어 객체
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 * @param tracker 이미지 트래커
	 */
	@SuppressWarnings("unchecked")
	private void drawVectorLayer(Element layer, SaveMapVO vo, Graphics2D graphics, MediaTracker tracker) {
		List<Element> features = layer.elements("FEATURE");
		
		for(Element feature : features) {
			if(feature.attribute("type").getValue().equalsIgnoreCase("point")) {
				drawSymbol(feature, vo, graphics, tracker);
			}
			else if(feature.attribute("type").getValue().equalsIgnoreCase("lineString")) {
				drawLineString(feature, vo, graphics);
			}
			else if(feature.attribute("type").getValue().equalsIgnoreCase("polygon")) {
				drawPolygon(feature, vo, graphics);
			}
		}
	}
	
	/**
	 * 점, 이미지 그리기
	 * @param feature 도형 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 * @param tracker 이미지트래커 
	 */
	private void drawSymbol(Element feature, SaveMapVO vo, Graphics2D graphics, MediaTracker tracker) {
		//좌표 구함
		double lon = Double.parseDouble(feature.elementText("x"));
		double lat = Double.parseDouble(feature.elementText("y"));
		
		int x = (int)Math.round(1/vo.getResolution() * (lon - vo.getLeft()));
		int y = (int)Math.round(1/vo.getResolution() * (vo.getTop() - lat));

		//이미지 or 선 투명도 구함
		String strokeOpacity = feature.elementText("opacity");
		AlphaComposite alpha;
		if((!strokeOpacity.equalsIgnoreCase("")) && (!strokeOpacity.equalsIgnoreCase("undefined"))) {
			alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(strokeOpacity));
		}
		else {
			alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0);
		}
		
		//도형 타입 구함
		String featureType = feature.elementText("featureType");
				
		//이미지 
		if(featureType.equalsIgnoreCase("image")) {
			//이미지
			String imgPath;
			try {
				imgPath = URLDecoder.decode(feature.elementText("image"), "UTF-8");
				Image img;
				if(imgPath.charAt(0) == '/') {
					img = Toolkit.getDefaultToolkit().getImage(new URL(vo.getRootContext() + imgPath));
				}
				else {
					img = Toolkit.getDefaultToolkit().getImage(new URL(imgPath));
				}
				
				//크기
				int width = Integer.parseInt(feature.elementText("width"));
				int height = Integer.parseInt(feature.elementText("height"));
				
				//왼쪽 상단 위치 좌표
				x -= width / 2;
				y -= height / 2;
				
				//투명도
				graphics.setComposite(alpha);
				
				tracker.addImage(img, 0);
				tracker.waitForAll();
				
				//이미지 그림
				graphics.drawImage(img, x, y, width, height, null);
			} catch (UnsupportedEncodingException e) {
				log.error("Unsupported UTF-8");
			} catch (InterruptedException e) {
				log.error("Image Tracker");
			} catch (MalformedURLException e) {
				log.error("URL Image");
			}
			
		}
		else {
			//면 투명도 구함
			String fillOpacity = feature.elementText("fillOpacity");
			AlphaComposite alphaFill;
			if((!fillOpacity.equalsIgnoreCase("")) && (!fillOpacity.equalsIgnoreCase("undefined"))) {
				alphaFill = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(fillOpacity));
			}
			else {
				alphaFill = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0);	
			}
			
			//면 색
			String rgb = feature.elementText("fillColor");
			int r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
			int g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
			int b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
			Color colorFill = new Color(r, g, b);
			
			//선 색
			rgb = feature.elementText("color");
			r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
			g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
			b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
			Color color = new Color(r, g, b);
			
			//반지름
			Integer radius = Integer.parseInt(feature.elementText("radius"));
			
			//도형 타입
			String graphicName = feature.elementText("graphicName");
		
			//선 굵기
			String strokeWidth = feature.elementText("stroke");
			if((!strokeWidth.equalsIgnoreCase("")) && (!strokeWidth.equalsIgnoreCase("undefined"))) {
				graphics.setStroke(new BasicStroke(Float.parseFloat(strokeWidth)));
			}
			else {
				graphics.setStroke(new BasicStroke(1.0f));
			}
			
			//사각형
			if(graphicName.equalsIgnoreCase("square")) {
				//좌표 구함
				int[] intX = new int[4];
				int[] intY = new int[4];
				intX[0] = x-radius;
				intX[1] = x-radius;
				intX[2] = x+radius;
				intX[3] = x+radius;
				
				intY[0] = y+radius;
				intY[1] = y-radius;
				intY[2] = y-radius;
				intY[3] = y+radius;
				
				//면 그림
				graphics.setComposite(alphaFill);
				graphics.setColor(colorFill);
				graphics.fillPolygon(intX, intY, 4);
				
				//선 그림
				graphics.setComposite(alpha);
				graphics.setColor(color);
				graphics.drawPolygon(intX, intY, 4);
			}
			//원
			else if(graphicName.equalsIgnoreCase("circle")) {
				//면 그림
				graphics.setComposite(alphaFill);
				graphics.setColor(colorFill);
				graphics.fillOval(x-radius, y-radius, radius*2, radius*2);				
				
				//테두리 그림
				graphics.setComposite(alpha);
				graphics.setColor(color);
				graphics.drawOval(x-radius, y-radius, radius*2, radius*2);
			}
			
			//선 굵기, 투명도 초기화
			graphics.setStroke(new BasicStroke((float)1));
			graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
		}
	}
	
	/**
	 * 선 그리기 
	 * @param feature 도형객체
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 */
	private void drawLineString(Element feature, SaveMapVO vo, Graphics2D graphics) {
		//좌표 구함
		String[] strX;
		String[] strY;
		
		String tempStr = feature.elementText("x");
		strX = tempStr.split(",");
		
		tempStr = feature.elementText("y");
		strY = tempStr.split(",");
		
		int[] intX = new int[strX.length];
		int[] intY = new int[strY.length];
		
		for(int i=0; i < strX.length; i++) {
			double lon = Double.parseDouble(strX[i]);
			double lat = Double.parseDouble(strY[i]);
			
			intX[i] = (int)Math.round(1/vo.getResolution() * (lon - vo.getLeft()));
			intY[i] = (int)Math.round(1/vo.getResolution() * (vo.getTop() - lat));
		}
		
		//투명도 구함
		String opacity = feature.elementText("opacity");
		if((!opacity.equalsIgnoreCase("")) && (!opacity.equalsIgnoreCase("undefined"))) {
			AlphaComposite alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(opacity));
			graphics.setComposite(alpha);
		}
		else {
			graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
		}
		
		//색 구함
		String rgb = feature.elementText("color");
		int r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
		int g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
		int b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
		
		graphics.setColor(new Color(r, g, b));
		
		//굵기 구함
		Float strokeWidth; 
		String strWidth = feature.elementText("stroke");
		if((!strWidth.equalsIgnoreCase("")) && (!strWidth.equalsIgnoreCase("undefined"))) {
			strokeWidth = Float.parseFloat(strWidth);
		}
		else {
			strokeWidth = new Float(1);
		}
		
		//모서리 스타일
		int strokeCap = BasicStroke.CAP_BUTT;
		String capType = feature.elementText("strokeLinecap");
		if((!capType.equalsIgnoreCase("")) && (!capType.equalsIgnoreCase("undefined"))) {
			if(capType.equalsIgnoreCase("butt")) {
				strokeCap = BasicStroke.CAP_BUTT;
			}
			else if(capType.equalsIgnoreCase("round")) {
				strokeCap = BasicStroke.CAP_ROUND;
			}
			else if(capType.equalsIgnoreCase("square")) {
				strokeCap = BasicStroke.CAP_SQUARE;
			}
		}
		
		//선 스타일
		float[] dashStyle = null;
		String dashType = feature.elementText("strokeDashstyle");
		if((!dashType.equalsIgnoreCase("")) && (!dashType.equalsIgnoreCase("undefined"))) {
			if(dashType.equalsIgnoreCase("dot")) {
				dashStyle = new float[] { 10.0f, 10.0f };
			}
			else if(dashType.equalsIgnoreCase("dash")) {
				dashStyle = new float[] { 35.0f, 15.0f };
			}
			else if(dashType.equalsIgnoreCase("dashdot")) {
				dashStyle = new float[] { 50.0f, 10.0f, 10.0f, 10.0f };
			}
			else if(dashType.equalsIgnoreCase("dashdotdot")) {
				dashStyle = new float[] { 50.0f, 10.0f, 10.0f, 10.0f, 10.0f, 10.0f };
			}
		}

		//스타일 적용
		if(dashStyle == null) {
			graphics.setStroke(new BasicStroke(strokeWidth, strokeCap, BasicStroke.JOIN_ROUND));
		}
		else {
			graphics.setStroke(new BasicStroke(strokeWidth, strokeCap, BasicStroke.JOIN_ROUND, 1.0f, dashStyle, 0f));
		}
		
		//선 그림
		graphics.drawPolyline(intX, intY, intX.length);
		
		//설정 초기화
		graphics.setStroke(new BasicStroke((float)1, BasicStroke.CAP_BUTT, BasicStroke.JOIN_ROUND));
		graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
	}
	
	/**
	 * 다각형 그리기
	 * @param feature 도형 엘리먼트
	 * @param vo 저장객체
	 * @param graphics 그리기객체
	 */
	private void drawPolygon(Element feature, SaveMapVO vo, Graphics2D graphics) {
		//좌표 구함		
		String[] strX;
		String[] strY;
		
		String tempStr = feature.elementText("x");
		strX = tempStr.split(",");
		
		tempStr = feature.elementText("y");
		strY = tempStr.split(",");
		
		int[] intX = new int[strX.length];
		int[] intY = new int[strY.length];
		
		for(int i=0; i < strX.length; i++) {
			double lon = Double.parseDouble(strX[i]);
			double lat = Double.parseDouble(strY[i]);
			
			intX[i] = (int)Math.round(1/vo.getResolution() * (lon - vo.getLeft()));
			intY[i] = (int)Math.round(1/vo.getResolution() * (vo.getTop() - lat));
		}
		
		//이미지 or 선 투명도 구함
		String strokeOpacity = feature.elementText("opacity");
		AlphaComposite alpha;
		if((!strokeOpacity.equalsIgnoreCase("")) && (!strokeOpacity.equalsIgnoreCase("undefined"))) {
			alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(strokeOpacity));
		}
		else {
			alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0);
		}
		
		//면 투명도 구함
		//면 투명도 구함
		String fillOpacity = feature.elementText("fillOpacity");
		AlphaComposite alphaFill;
		if((!fillOpacity.equalsIgnoreCase("")) && (!fillOpacity.equalsIgnoreCase("undefined"))) {
			alphaFill = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, Float.parseFloat(fillOpacity));
		}
		else {
			alphaFill = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0);	
		}
		
		//면 색
		String rgb = feature.elementText("fillColor");
		int r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
		int g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
		int b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
		Color colorFill = new Color(r, g, b);
		
		//선 색
		rgb = feature.elementText("color");
		r = Integer.parseInt(getHexToDec(rgb.substring(1, 3)));
		g = Integer.parseInt(getHexToDec(rgb.substring(3, 5)));
		b = Integer.parseInt(getHexToDec(rgb.substring(5, 7)));
		Color color = new Color(r, g, b);
		
		
		//굵기 구함
		Float strokeWidth; 
		String strWidth = feature.elementText("stroke");
		if((!strWidth.equalsIgnoreCase("")) && (!strWidth.equalsIgnoreCase("undefined"))) {
			strokeWidth = Float.parseFloat(strWidth);
		}
		else {
			strokeWidth = new Float(1);
		}
		
		//모서리 스타일
		int strokeCap = BasicStroke.CAP_BUTT;
		String capType = feature.elementText("strokeLinecap");
		if((!capType.equalsIgnoreCase("")) && (!capType.equalsIgnoreCase("undefined"))) {
			if(capType.equalsIgnoreCase("butt")) {
				strokeCap = BasicStroke.CAP_BUTT;
			}
			else if(capType.equalsIgnoreCase("round")) {
				strokeCap = BasicStroke.CAP_ROUND;
			}
			else if(capType.equalsIgnoreCase("square")) {
				strokeCap = BasicStroke.CAP_SQUARE;
			}
		}
		
		//선 스타일
		float[] dashStyle = null;
		String dashType = feature.elementText("strokeDashstyle");
		if((!dashType.equalsIgnoreCase("")) && (!dashType.equalsIgnoreCase("undefined"))) {
			if(dashType.equalsIgnoreCase("dot")) {
				dashStyle = new float[] { 10.0f, 10.0f };
			}
			else if(dashType.equalsIgnoreCase("dash")) {
				dashStyle = new float[] { 35.0f, 15.0f };
			}
			else if(dashType.equalsIgnoreCase("dashdot")) {
				dashStyle = new float[] { 50.0f, 10.0f, 10.0f, 10.0f };
			}
			else if(dashType.equalsIgnoreCase("dashdotdot")) {
				dashStyle = new float[] { 50.0f, 10.0f, 10.0f, 10.0f, 10.0f, 10.0f };
			}
		}

		//스타일 적용
		if(dashStyle == null) {
			graphics.setStroke(new BasicStroke(strokeWidth, strokeCap, BasicStroke.JOIN_ROUND));
		}
		else {
			graphics.setStroke(new BasicStroke(strokeWidth, strokeCap, BasicStroke.JOIN_ROUND, 1.0f, dashStyle, 0f));
		}
		
		//면 그리기
		graphics.setColor(colorFill);
		graphics.setComposite(alphaFill);
		graphics.fillPolygon(intX, intY, intX.length);
		
		//선 그리기
		graphics.setColor(color);
		graphics.setComposite(alpha);
		graphics.drawPolygon(intX, intY, intX.length);
		
		//설정 초기화
		graphics.setStroke(new BasicStroke((float)1, BasicStroke.CAP_BUTT, BasicStroke.JOIN_ROUND));
		graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, (float)1.0));
	}
	
	/**
	 * TMS Url 반환
	 * @param url TMS 서버 주소
	 * @param resolution 화면 해상도
	 * @param tileSizeW 타일너비
	 * @param tileSizeH 타일높이
	 * @param extension 이미지확장자
	 * @param left 왼쪽 Offset
	 * @param top 위쪽 Offset
	 * @param maxLeft 최대영역 왼쪽 좌표
	 * @param maxBottom 최대영역 아래쪽 좌표
	 * @param maxRight 최대영역 오른쪽 좌표
	 * @param maxTop 최대영역 위쪽 좌표
	 * @param scaleLevel 축척레벨
	 * @return 이미지주소
	 */
	private String getTMSXYZ(String url, double resolution, int tileSizeW, int tileSizeH, String extension, double left, double bottom, double maxLeft, double maxBottom, double maxRight, double maxTop, int scaleLevel) {
		int x = (int) (Math.round((left - maxLeft) / (resolution * tileSizeW)));
		int y = (int) (Math.round((bottom - maxBottom) / (resolution * tileSizeH)));
		int z = scaleLevel;
		
		StringBuffer sb = new StringBuffer();
		
		if(z == 0) {
			sb.append("http://i1.daumcdn.net/dmaps/apis/white.png");
		}
		else {
			sb.append(url.substring(0, url.indexOf("/L$")+2));
			sb.append(z);
			sb.append("/");
			sb.append(y);
			sb.append("/");
			sb.append(x);
			sb.append(".");
			sb.append(extension);	
		}
		return sb.toString();
	}
	
	/**
	 * 16 진수를 10진수로 변환
	 * @param hex
	 * @return
	 */
	private String getHexToDec(String hex) {
		long v = Long.parseLong(hex, 16);
		return String.valueOf(v);
	}
	
}
