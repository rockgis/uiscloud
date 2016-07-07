package org.uiscloud.gis.bookmark.service;

public class BookmarkVO {
    private Integer bookmarkMasterId;
    private String headOffice; 		// 북마크 소속 본부 ID
    private String creator;		// 작성자 성명
    private String title;			// 북마크 제목
    
    public BookmarkVO() {
    	
    }
    
  	public BookmarkVO(Integer bookmarkMasterId, String regionCode, String userName,
			String title) {
		super();
		this.setBookmarkMasterId(bookmarkMasterId);
		this.headOffice = regionCode;
		this.creator = userName;
		this.title = title;
	}

	public Integer getBookmarkMasterId() {
		return bookmarkMasterId;
	}

	public void setBookmarkMasterId(Integer bookmarkMasterId) {
		this.bookmarkMasterId = bookmarkMasterId;
	}

	public String getHeadOffice() {
		return headOffice;
	}

	public void setHeadOffice(String headOffice) {
		this.headOffice = headOffice;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}