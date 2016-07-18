/**
 * 
 */
package org.uiscloud.spark.model;

import java.io.Serializable;

/**
 * @author hooni
 *
 */
public class MongoOutput implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5353934896800858852L;
	private double lon;
	private double lat;
	private Integer level;
	private Integer count;
	/**
	 * @return the lon
	 */
	public double getLon() {
		return lon;
	}
	/**
	 * @param lon the lon to set
	 */
	public void setLon(double lon) {
		this.lon = lon;
	}
	/**
	 * @return the lat
	 */
	public double getLat() {
		return lat;
	}
	/**
	 * @param lat the lat to set
	 */
	public void setLat(double lat) {
		this.lat = lat;
	}
	/**
	 * @return the level
	 */
	public Integer getLevel() {
		return level;
	}
	/**
	 * @param level the level to set
	 */
	public void setLevel(Integer level) {
		this.level = level;
	}
	/**
	 * @return the count
	 */
	public Integer getCount() {
		return count;
	}
	/**
	 * @param count the count to set
	 */
	public void setCount(Integer count) {
		this.count = count;
	}
	/**
	 * @return the serialversionuid
	 */
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MongoOutput [lon=" + lon + ", lat=" + lat + ", level=" + level + ", count=" + count + ", getLon()=" + getLon() + ", getLat()=" + getLat() + ", getLevel()=" + getLevel()
				+ ", getCount()=" + getCount() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}
	
	
}
