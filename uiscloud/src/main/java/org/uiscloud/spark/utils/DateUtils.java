
package org.uiscloud.spark.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * @author hooni
 *
 */
public class DateUtils {

    /**
     * 두날짜 사이의 일수를 리턴
     *
     * @param fromDate yyyyMMdd 형식의 시작일
     * @param toDate yyyyMMdd 형식의 종료일
     * @return 두날짜 사이의 일수
     */
    public static int getDiffDayCount(String fromDate, String toDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

        try {
            return (int) ((sdf.parse(toDate).getTime() - sdf.parse(fromDate).getTime()) / 1000 / 60 / 60 / 24);
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 시작일부터 종료일까지 사이의 날짜를 배열에 담아 리턴 ( 시작일과 종료일을 모두 포함한다 )
     *
     * @param fromDate yyyyMMdd 형식의 시작일
     * @param toDate yyyyMMdd 형식의 종료일
     * @return yyyyMMdd 형식의 날짜가 담긴 배열
     */
    public static String[] getDiffDays(String fromDate, String toDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

        Calendar cal = Calendar.getInstance();

        try {
            cal.setTime(sdf.parse(fromDate));
        } catch (Exception e) {
            e.printStackTrace();
        }

        int count = getDiffDayCount(fromDate, toDate);

        // 시작일부터
        cal.add(Calendar.DATE, -1);

        // 데이터 저장
        ArrayList<String> list = new ArrayList<String>();

        for (int i = 0; i <= count; i++) {
            cal.add(Calendar.DATE, 1);

            list.add(sdf.format(cal.getTime()));
        }

        String[] result = new String[list.size()];

        list.toArray(result);

        return result;
    }

    /**
     * <p>
     * 8자리 또는 14자리 날짜 스트링을 주고 [2006-01-01](splitDate = "-")의 포맷을 가져옴.
     * </p>
     *
     * @param date 8자리 또는 14자리로된 숫자로된 날짜대상 값.
     * @param split Date 구분자
     *
     * @return 포맷된 날짜.
     */
    public static String getFormatedDateYear(String date, String split) {

        if (date == null) {
            return " ";
        } else if (!ValidateUtils.isAlphaNumeric(date)) {
            return date;
        }
        if (date.length() != 14 && date.length() != 8) {
            return " ";
        }

        StringBuffer returnDate = new StringBuffer(10);
        returnDate.append(date.substring(0, 4));
        returnDate.append(split);
        returnDate.append(date.substring(4, 6));
        returnDate.append(split);
        returnDate.append(date.substring(6, 8));

        return returnDate.toString();
    }

    /**
     * <p>
     * 14자리 날짜 스트링을 주고 [2006-01-01 12:12](splitDate = "-", splitTime = ":")의 포맷을 가져옴.
     * </p>
     *
     * @param date 12자리로된 숫자로된 날짜대상 값.
     * @param splitDate Date 구분자
     * @param splitTime Time 구분자
     *
     * @return 포맷된 날짜.
     */
    public static String getFormatedDateMinute(
            String date,
            String splitDate,
            String splitTime) {

        if (date == null) {
            return " ";
        } else if (!ValidateUtils.isAlphaNumeric(date)) {
            return date;
        }
        if (date.length() != 12) {
            return " ";
        }

        StringBuffer returnDate = new StringBuffer(16);
        returnDate.append(date.substring(0, 4));
        returnDate.append(splitDate);
        returnDate.append(date.substring(4, 6));
        returnDate.append(splitDate);
        returnDate.append(date.substring(6, 8));
        returnDate.append(" ");
        returnDate.append(date.substring(8, 10));
        returnDate.append(splitTime);
        returnDate.append(date.substring(10, 12));

        return returnDate.toString();
    }

    /**
     * <p>
     * 14자리 날짜 스트링을 주고 [2006-01-01 12:12:24](splitDate = "-", splitTime = ":")의 포맷을 가져옴.
     * </p>
     *
     * @param date 14자리로된 숫자로된 날짜대상 값.
     * @param splitDate Date 구분자
     * @param splitTime Time 구분자
     *
     * @return 포맷된 날짜.
     */
    public static String getFormatedDateTime(
            String date,
            String splitDate,
            String splitTime) {

        if (date == null) {
            return " ";
        } else if (!ValidateUtils.isAlphaNumeric(date)) {
            return date;
        }
        if (date.length() != 14) {
            return " ";
        }

        StringBuffer returnDate = new StringBuffer(10);
        returnDate.append(date.substring(0, 4));
        returnDate.append(splitDate);
        returnDate.append(date.substring(4, 6));
        returnDate.append(splitDate);
        returnDate.append(date.substring(6, 8));
        returnDate.append(" ");
        returnDate.append(date.substring(8, 10));
        returnDate.append(splitTime);
        returnDate.append(date.substring(10, 12));
        returnDate.append(splitTime);
        returnDate.append(date.substring(12, 14));

        return returnDate.toString();
    }

    /**
     * <p>
     * 날짜 스트링과 구분자를 주고 해당 포맷을 가져옴.
     * </p>
     *
     * @param date 6자리나 8자리로된 숫자로된 날짜대상 값.
     * @param delimiter 년, 월, 일 사이에 들어가게 되는 구분자.
     * @return 포맷된 날짜.
     */
    public static String getFormatedDate(String date, String delimiter) {

        String lm_sYear = null;
        String lm_sMonth = null;
        String lm_sDay = null;

        if (date == null) {
            return " ";
        } else if (!ValidateUtils.isAlphaNumeric(date)) {
            return date;
        }

        int lm_iLength = date.trim().length();

        if (lm_iLength == 6) {
            lm_sYear = date.substring(0, 2);
            lm_sMonth = date.substring(2, 4);
            lm_sDay = date.substring(4, 6);
        } else if (lm_iLength == 8) {
            lm_sYear = date.substring(0, 4);
            lm_sMonth = date.substring(4, 6);
            lm_sDay = date.substring(6, 8);
        } else {
            return date;
        }

        return lm_sYear + delimiter + lm_sMonth + delimiter + lm_sDay;
    }

    /**
     * <p>
     * 날짜 스트링을 주고 2002년 01월 01의 포맷을 가져옴.
     * </p>
     *
     * @param date 6자리나 8자리로된 숫자로된 날짜대상 값.
     * @return 포맷된 날짜.
     */
    public static String getFormatedDate(String date) {

        String lm_sYear = null;
        String lm_sMonth = null;
        String lm_sDay = null;

        if (date == null) {
            return " ";
        } else if (!ValidateUtils.isAlphaNumeric(date)) {
            return date;
        }
        int lm_iLength = date.trim().length();
        if (lm_iLength == 6) {
            lm_sYear = date.substring(0, 2);
            lm_sMonth = date.substring(2, 4);
            lm_sDay = date.substring(4, 6);
        } else if (lm_iLength == 8) {
            lm_sYear = date.substring(0, 4);
            lm_sMonth = date.substring(4, 6);
            lm_sDay = date.substring(6, 8);
        } else {
            return date;
        }

        return lm_sYear + "년 " + lm_sMonth + "월 " + lm_sDay + "일 ";
    }

    /**
     * <p>
     * 현재날짜 가져오기 (YYYY-MM-DD)
     * </p>
     *
     * @return 포맷된 날짜 (YYYY-MM-DD).
     */
    public static String getToday() {
        return getToday("yyyy-MM-dd");
    }

    /**
     * <p>
     * 입력받은 형식에 맞는 현재날짜 및 시간 가져옴.
     * </p>
     *
     * @param fmt 날짜형식
     * @return 현재일자 ----------------------------------------- 포맷 패턴 결과 ----------------------------------------- "yyyy.MM.dd G 'at' hh:mm:ss z" ->> 1996.07. 10 AD at 15:08:56 PDT "EEE, MMM d, ''yy" ->> Wed, July 10, '96 "h:mm a" ->> 12:08 PM "hh 'o''clock' a, zzzz" ->> 12 o'clock PM, Pacific Daylight Time "K:mm a, z" ->> 0:00 PM, PST "yyyyy.MMMMM.dd GGG hh:mm aaa" ->> 1996. July. 10 AD 12:08 PM
     */
    public static String getToday(String fmt) {
        SimpleDateFormat sfmt = new SimpleDateFormat(fmt);
        return sfmt.format(new Date());
    }

    /**
     * <p>
     * Date형을 yyyy-MM-dd형의 문자열로 변환.
     * </p>
     *
     * @param date 날짜 Date형
     * @return 날짜 String형. null일 경우 공백 리턴.
     */
    public static String dateToString(Date date) {
        if (date != null)
            return dateToString(date, "yyyy-MM-dd");
        return "";
    }

    /**
     * <p>
     * Date형을 원하는 포맷으로 변환하여 스트링으로 전환.
     * </p>
     *
     * @param date 대상 날짜.
     * @param fmt 날짜형식
     * @return 포맷된 날짜. null일 경우 공백 리턴. ----------------------------------------- 포맷 패턴 결과 ----------------------------------------- "yyyy.MM.dd G 'at' hh:mm:ss z" ->> 1996.07. 10 AD at 15:08:56 PDT "EEE, MMM d, ''yy" ->> Wed, July 10, '96 "h:mm a" ->> 12:08 PM "hh 'o''clock' a, zzzz" ->> 12 o'clock PM, Pacific Daylight Time "K:mm a, z" ->> 0:00 PM, PST "yyyyy.MMMMM.dd GGG hh:mm aaa" ->> 1996. July. 10 AD 12:08 PM
     */
    public static String dateToString(Date date, String fmt) {
        if (date != null && fmt != null) {
            SimpleDateFormat sfmt = new SimpleDateFormat(fmt);
            return sfmt.format(date);
        }
        return "";
    }

    /**
     * <p>
     * 특정 포맷의 문자열을 Date 타입으로 변환.
     * </p>
     *
     * @param date 대상날짜.
     * @param fmt 대상날짜의 포맷.
     * @return 변경된 Date타입. 대상날짜의 오류가 있을 경우 null 리턴.
     */
    public static Date stringToDate(String date, String fmt) {

        if (date != null && fmt != null) {
            SimpleDateFormat sfmt = new SimpleDateFormat(fmt);
            try {
                return sfmt.parse(date);
            } catch (ParseException pe) {
                return null;
            }
        }
        return null;
    }

    /**
     * <p>
     * "yyyyMMdd" 형태로 현재 날짜를 변환하여 반환한다.
     * </p>
     *
     * @return 현재 날짜 (yyyyMMdd).
     */
    public static String getShortDateString() {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMdd", java.util.Locale.KOREA);
        return formatter.format(new java.util.Date());
    }

    /**
     * <p>
     * 인자로 받은 Date타입을 "yyyyMMdd" 형태의 문자열로 변환.
     * </p>
     *
     * @param d 날짜 객체
     * @return 변경된 날짜 (yyyyMMdd).
     */
    public static String getShortDateString(Date d) {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMdd", java.util.Locale.KOREA);
        return formatter.format(d);
    }

    /**
     * <p>
     * "HHmmss" 형태로 현재 시간을 변환하여 반환한다.
     * </p>
     *
     * @return 현재 시간 (HHmmss).
     */
    public static String getShortTimeString() {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HHmmss", java.util.Locale.KOREA);
        return formatter.format(new java.util.Date());
    }

    /**
     * <p>
     * 인자로 받은 Date타입을 "HHmmss" 형태의 문자열로 변환.
     * </p>
     *
     * @param d 날짜 객체
     * @return 변경된 시간 (HHmmss).
     */
    public static String getShortTimeString(Date d) {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HHmmss", java.util.Locale.KOREA);
        return formatter.format(d);
    }

    /**
     * <p>
     * 현재 날짜를 "yyyy-MM-dd-HH:mm:ss:SSS" 형태로 변환.
     * </p>
     *
     * @return 현재 날짜와 시간 (yyyy-MM-dd-HH:mm:ss:SSS).
     */
    public static String getTimeStampString() {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.KOREA);
        return formatter.format(new java.util.Date());
    }

    /**
     * <p>
     * 인자로 받은 Date타입을 "yyyy-MM-dd-HH:mm:ss:SSS" 형태의 문자열로 변환.
     * </p>
     *
     * @param d 날짜 객체
     * @return 변경된 날짜와 시간 (yyyy-MM-dd-HH:mm:ss:SSS).
     */
    public static String getTimeStampString(Date d) {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.KOREA);
        return formatter.format(d);
    }

    /**
     * <p>
     * 현재 시간을 "HH:mm:ss" 형태로 변환.
     * </p>
     *
     * @return 현재 시간 (HH:mm:ss).
     */
    public static String getTimeString() {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.KOREA);
        return formatter.format(new java.util.Date());
    }

    /**
     * <p>
     * 인자로 받은 Date타입을 "HH:mm:ss" 형태의 문자열로 변환.
     * </p>
     *
     * @param d 날짜 객체
     * @return 변경된 날짜와 시간 (HH:mm:ss).
     */
    public static String getTimeString(Date d) {
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.KOREA);
        return formatter.format(d);
    }

    /**
     * <p>
     * 인자로 받은 Date 타입을 java.sql.Date 타입으로 변환.
     * </p>
     *
     * @param date 날짜 객체
     * @return 변경된 java.sql.Date 타입.
     */
    public static java.sql.Date dateToSqlDate(java.util.Date date) {
        return new java.sql.Date(date.getTime());
    }

    /**
     * 특정일의 요일 구하기
     *
     * @param sDate
     *            (yyyyMMdd)
     * @return String
     */
    public static String getWeekDay(String sDate) {

        String result = "";

        Calendar cal = Calendar.getInstance();
        cal.set(Integer.parseInt(sDate.substring(0, 4)), Integer.parseInt(sDate.substring(4, 6)) - 1, Integer.parseInt(sDate.substring(6)));

        switch (cal.get(Calendar.DAY_OF_WEEK)) {
            case 1:
                result = "일";
                break;
            case 2:
                result = "월";
                break;
            case 3:
                result = "화";
                break;
            case 4:
                result = "수";
                break;
            case 5:
                result = "목";
                break;
            case 6:
                result = "금";
                break;
            case 7:
                result = "토";
                break;
        }

        return result;
    }
    
    /**
     * @param date yyyyMMdd 의 날짜형식
     * @return 실제 날짜인지 여부
     */
    public static boolean checkDate(String date) {
	    SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat("yyyyMMdd");
	    String str = null;
	    try
	    {
	      str = localSimpleDateFormat.format(localSimpleDateFormat.parse(date));
	    }
	    catch (ParseException localParseException)
	    {
	    }
	    return date.equals(str);
	}

    /**
     * @param date yyyyMMddHHmmss 의 시간형식
     * @return 실제 시간인지 여부
     */
	public static boolean checkDateTime(String date) {
	    SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
	    String str = null;
	    try
	    {
	      str = localSimpleDateFormat.format(localSimpleDateFormat.parse(date));
	    }
	    catch (ParseException localParseException)
	    {
	    }
	    return date.equals(str);
	}
}
