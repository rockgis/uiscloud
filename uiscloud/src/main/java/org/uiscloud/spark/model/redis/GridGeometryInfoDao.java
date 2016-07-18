package org.uiscloud.spark.model.redis;

public class GridGeometryInfoDao {

		private GridCoordinateDao coordinates;
		private double count;
		public GridCoordinateDao getCoordinates() {
			return coordinates;
		}
		public void setCoordinates(GridCoordinateDao coordinates) {
			this.coordinates = coordinates;
		}
		public double getCount() {
			return count;
		}
		public void setCount(double count) {
			this.count = count;
		}
	
}
