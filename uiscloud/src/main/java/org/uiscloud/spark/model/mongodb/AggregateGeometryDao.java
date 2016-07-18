package org.uiscloud.spark.model.mongodb;

import java.util.List;

public class AggregateGeometryDao extends GeometryObjectDao{
	private List<List<double[]>> coordinates;

//	  coordinates : [ 
//    [ 
//      [ 123.88176283421768, 35.07449540360071 ] ,
//      [ 131.49049934709979, 35.07449540360071 ] , 
//      [ 131.49049934709979, 37.33632589267329 ] , 
//      [ 123.88176283421768, 37.33632589267329 ] , 
//      [ 123.88176283421768, 35.07449540360071  ] 
//     ] 
//  ] 

//	private ArrayList<double[]>

	public AggregateGeometryDao() {
		super();
		this.setType("Polygon");
	}
	
	public List<List<double[]>> getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(List<List<double[]>> coordinates) {
		this.coordinates = coordinates;
	}

}
