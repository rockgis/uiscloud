package org.uiscloud.spark.util;

import java.util.ArrayList;
import java.util.Random;

import org.uiscloud.spark.model.redis.GridCoordinateDao;

public class GeoGridConverter {

	private final static int indexLon = 0;
	private final static int indexLat = 1;

	private int maxLevel;

	private int baseRow;
	private int baseCol;

	private double[] boundary;


	public GeoGridConverter() {
		this.maxLevel = 20;
		this.baseRow = 20;
		this.baseCol = 40;
		this.boundary = new double[] { 360, 180 };
	}

	public GeoGridConverter(int maxLevel, int baseRow, int baseCol, double[] boundary) {

		this.maxLevel = maxLevel;
		this.baseRow = baseRow;
		this.baseCol = baseCol;
		this.boundary = boundary;

	}

	public double getOffeset(double length, int base, int level) {
		return length / ((double) base * Math.pow(2, level));
	}

	public ArrayList<GridCoordinateDao> getGeoGridLocation(int level, double[] southWest, double[] northEast) {

		this.convertInBound(southWest, northEast);

		double[] gridSouthWest = this.convertToGridLocation(level, southWest);
		double[] gridNorthEast = this.convertToGridLocation(level, northEast);

		return this.getGridPoint(level, gridSouthWest, gridNorthEast);
	}

	public ArrayList<ArrayList<GridCoordinateDao>> getGeoGridLocation(String id, int level, double[] southWest, double[] northEast, int offset) {

		this.convertInBound(southWest, northEast);

		ArrayList<Integer> randIdx = this.createIdex(3 * 3);
		return this.getGridPoint(id, level, southWest, northEast, offset, 3, randIdx);

	}

	public double[] convertToGridLocation(int level, double[] point) {
		double[] gridPoint = new double[point.length];

		for (int i = 0; i < gridPoint.length; i++) {
			double offset = this.getOffeset(this.boundary[i], (i == 0) ? this.baseRow : this.baseCol, level);
			double plainLoc = this.convertToQuadrantOne(i, point[i]);

			int idx = (int) (plainLoc / offset);

			gridPoint[i] = (double) idx * offset + ((offset) / (double) 2) - ((boundary[i]) / 2);
		}

		return gridPoint;
	}

	public void convertInBound(double[] southWest, double[] northEast) {
		double minx = 0.0 - (double) (this.boundary[indexLon] / 2);
		double miny = 0.0 - (double) (this.boundary[indexLat] / 2);

		double maxx = 0.0 + (double) (this.boundary[indexLon] / 2);
		double maxy = 0.0 + (double) (this.boundary[indexLat] / 2);

		southWest[0] = southWest[0] < minx ? minx : southWest[0];
		southWest[1] = southWest[1] < miny ? miny : southWest[1];
		northEast[0] = northEast[0] > maxx ? maxx : northEast[0];
		northEast[1] = northEast[1] > maxy ? maxy : northEast[1];
	}

	private ArrayList<GridCoordinateDao> getGridPoint(int level, double[] gridSouthWest, double[] gridNorthEast) {

		double offsetLon = this.getOffeset(this.boundary[indexLon], this.baseRow, level);
		double offsetLat = this.getOffeset(this.boundary[indexLat], this.baseCol, level);

		ArrayList<GridCoordinateDao> keysPoint = new ArrayList<GridCoordinateDao>();

		double x = gridSouthWest[indexLon];
		double y = gridNorthEast[indexLat];

		for (; x <= gridNorthEast[indexLon]; x += offsetLon) {
			for (; y >= gridSouthWest[indexLat]; y -= offsetLat) {
				GridCoordinateDao cDao = new GridCoordinateDao();
				cDao.setLon(x);
				cDao.setLat(y);

				keysPoint.add(cDao);
			}
		}
		return keysPoint;
	}

	private ArrayList<ArrayList<GridCoordinateDao>> getGridPoint(String id, int level, double[] gridSouthWest, double[] gridNorthEast, int offset,
			int count, ArrayList<Integer> randIdx) {
		//유효 그리드로 변경 
		ArrayList<double[][]> boundArr = this.divideRange(gridSouthWest, gridNorthEast);
		
		ArrayList<ArrayList<GridCoordinateDao>> indexPoints = new ArrayList<ArrayList<GridCoordinateDao>>();
		for (double[][] arr : boundArr) {
			indexPoints.addAll(
					this.createPartRange(id, level, arr[0], arr[1], offset, count, randIdx)
					);
		}

		return indexPoints;
	}

	private ArrayList<ArrayList<GridCoordinateDao>> createPartRange(String id, int level, double[] gridSouthWest, double[] gridNorthEast, int offset, int count, ArrayList<Integer> randIdx) {
		double dCount = (double) count;


		double lengthX = this.convertToQuadrantOne(indexLon, gridNorthEast[indexLon]) - this.convertToQuadrantOne(indexLon, gridSouthWest[indexLon]);
		double lengthY = this.convertToQuadrantOne(indexLat, gridNorthEast[indexLat]) - this.convertToQuadrantOne(indexLat, gridSouthWest[indexLat]);

		lengthX /= dCount;
		lengthY /= dCount;
		
		ArrayList<ArrayList<GridCoordinateDao>> indexPoints = new ArrayList<ArrayList<GridCoordinateDao>>();
		
		for (Integer x : randIdx) {

			double xx = (double) (x % count);
			double yy = (double) (x / count);

			double x1 = gridSouthWest[indexLon] + (lengthX * xx);
			double y1 = gridSouthWest[indexLat] + (lengthY * yy);

			double x2 = gridSouthWest[indexLon] + (lengthX * xx) + lengthX;
			double y2 = gridSouthWest[indexLat] + (lengthY * yy) + lengthY;

			x2 = x2 > gridNorthEast[indexLon] ? gridNorthEast[indexLon] : x2;
			y2 = y2 > gridNorthEast[indexLat] ? gridNorthEast[indexLat] : y2;

//			System.out.println(">>>>>> "+ x +" x1 : "+x1+" y1 :"+y1+" x2 : "+x2+" y2 : "+y2);
			ArrayList<ArrayList<GridCoordinateDao>> idxPoints = this.getIndexingGridPoint(id, level, new double[] { x1, y1 }, new double[] { x2, y2 }, offset,x);
			indexPoints.addAll(idxPoints);
		}
		
		return indexPoints;
	}

	private ArrayList<double[][]> divideRange(double[] southWest, double[] northEast) {
		ArrayList<double[][]> partArr = new ArrayList<double[][]>();
		if (southWest[indexLon] < northEast[indexLon]) {
			double[][] part = new double[][] { southWest, northEast };
			partArr.add(part);

		} else if (southWest[indexLon] == northEast[indexLon]) {
			double[][] part = new double[][] { { (double) -180, southWest[indexLat] },
					{ (double) 180, northEast[indexLat] } };
			partArr.add(part);
		} else {
			double[][] part = new double[][] { southWest, { (double) 180, northEast[indexLat] } };
			partArr.add(part);
			part = new double[][] { { (double) -180, southWest[indexLat] },
					{ ((northEast[indexLon])), northEast[indexLat] } };
			partArr.add(part);

		}
		return partArr;
	}

	private ArrayList<ArrayList<GridCoordinateDao>> getIndexingGridPoint(String id, int level, double[] gridSouthWest, double[] gridNorthEast,
			int offset, int idx) {
		double[] iGridSouthWest = this.convertToGridLocation(level, gridSouthWest);
		double[] iGridNorthEast = this.convertToGridLocation(level, gridNorthEast);

		double offsetLon = this.getOffeset(this.boundary[indexLon], this.baseRow, level);
		double offsetLat = this.getOffeset(this.boundary[indexLat], this.baseCol, level);

		ArrayList<ArrayList<GridCoordinateDao>> rt = new ArrayList<ArrayList<GridCoordinateDao>>();
		ArrayList<GridCoordinateDao> keysPoint = new ArrayList<GridCoordinateDao>();

		double x = iGridSouthWest[indexLon];

		for (; x <= iGridNorthEast[indexLon]; x += offsetLon) {
			for (double y = iGridNorthEast[indexLat]; y >= iGridSouthWest[indexLat]; y -= offsetLat) {
				GridCoordinateDao cDao = new GridCoordinateDao();
				cDao.setLon(x);
				cDao.setLat(y);

				keysPoint.add(cDao);
				if (keysPoint.size() == offset) {
					
//					this.listner.readGirdByOffset(keysPoint, level, id, idx);
					rt.add(keysPoint);
					keysPoint = new ArrayList<GridCoordinateDao>();
				}
			}
		}

		if (keysPoint.size() > 0) {
			rt.add(keysPoint);
		}
		
		return rt;
	}

	private ArrayList<Integer> createIdex(int count) {
		ArrayList<Integer> arr = new ArrayList<Integer>();

		Random rand = new Random();

		for (int i = 0; i < count; i++) {
			int num = rand.nextInt(count);
			if (arr.size() == 0 || !arr.contains(num)) {
				arr.add(num);
			} else {
				i--;
			}
		}

		return arr;
	}

	private double convertToQuadrantOne(int idx, double value) {
		double plainLoc = (this.boundary[idx] / 2) + value;
		return plainLoc;
	}
}
