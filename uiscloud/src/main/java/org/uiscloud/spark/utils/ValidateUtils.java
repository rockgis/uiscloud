
package org.uiscloud.spark.utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;

/**
 * @author hooni
 */
public class ValidateUtils {

    /**
     * <p>
     * 占쏙옙占쏙옙 占쌍댐옙占쏙옙占�확占쏙옙.
     * </p>
     *
     * @param 占쌍댐옙占쏙옙見占�확占쏙옙占쏙옙 占쏙옙占�占쏙옙占쌘울옙.
     * @param 占쌍댐옙占쏙옙占�占쏙옙.
     * @return 占쏙옙占싱몌옙 占십곤옙占싹몌옙 TRUE, 占싱댐옙占싹몌옙 FALSE.
     */
    public static boolean maxLen(String data, int maxLength) {
        return (data.length() > maxLength);
    }

    /**
     * <p>
     * 占쏙옙占쏙옙 占쌍소깍옙占쏙옙 확占쏙옙.
     * </p>
     *
     * @param 占쌍소깍옙占싱몌옙 확占쏙옙占쏙옙 占쏙옙占�占쏙옙占쌘울옙.
     * @param 占쌍소깍옙占쏙옙 占쏙옙.
     * @return 占쏙옙占싱븝옙占쏙옙 占쏙옙8占쏙옙(占싱댐옙占싹몌옙) TRUE, 占십곤옙占싹몌옙 FALSE.
     */
    public static boolean minLen(String data, int minLength) {
        return ((data != null) && (data.length() < minLength));
    }

    /**
     * <p>
     * 占쌀쇽옙占쏙옙 占쏙옙' 확占쏙옙.
     * </p>
     *
     * @param 占쏙옙占쏙옙 占쏙옙'占쏙옙占쏙옙 占쏙옙占싹댐옙占쏙옙 확占쏙옙占쏙옙 占쏙옙.
     * @param 占쏙옙占쏙옙 占쌍소곤옙(占쏙옙占쌜곤옙).
     * @param 占쏙옙占쏙옙 占쌍대값(占쏙옙占쌜곤옙).
     * @return 占쏙옙占쏙옙 占쏙옙'占쏙옙 占쏙옙占쏙옙占싹몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean betweenVal(
            double data,
            double lowerData,
            double upperData) {
        return ((lowerData < data) && (data < upperData));
    }

    /**
     * <p>
     * d占쏙옙占쏙옙 占쏙옙' 확占쏙옙.
     * </p>
     *
     * @param 占쏙옙占쏙옙 占쏙옙'占쏙옙占쏙옙 占쏙옙占싹댐옙占쏙옙 확占쏙옙占쏙옙 占쏙옙.
     * @param 占쏙옙占쏙옙 占쌍소곤옙(占쏙옙占쌜곤옙).
     * @param 占쏙옙占쏙옙 占쌍대값(占쏙옙占쌜곤옙).
     * @return 占쏙옙占쏙옙 占쏙옙'占쏙옙 占쏙옙占쏙옙占싹몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean betweenVal(int data, int lowerData, int upperData) {
        return ((lowerData < data) && (data < upperData));
    }

    /**
     * <p>
     * 占쏙옙짜占쏙옙占쏙옙 占쏙옙' 확占쏙옙.
     * </p>
     *
     * @param 占쏙옙占쏙옙 占쏙옙'占쏙옙占쏙옙 占쏙옙占싹댐옙占쏙옙 확占쏙옙占쏙옙 占쏙옙짜占쏙옙.
     * @param 占쏙옙짜占쏙옙占쏙옙 占쌍소곤옙(占쏙옙占쌜곤옙).
     * @param 占쏙옙짜占쏙옙占쏙옙 占쌍대값(占쏙옙占쌜곤옙).
     * @return 占쏙옙占쏙옙 占쏙옙'占쏙옙 占쏙옙占쏙옙占싹몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean betweenVal(Date data, Date lowerData, Date upperData) {
        return ((data.after(lowerData)) && (data.before(upperData)));
    }

    /**
     * <p>
     * 占쏙옙占쌘울옙 占쏙옙占쏙옙占쏙옙 占쏙옙' 확占쏙옙.
     * </p>
     *
     * @param 占쏙옙占싱곤옙 占쏙옙'占쏙옙占쏙옙 占쏙옙占싹댐옙占쏙옙 확占쏙옙占쏙옙 占쏙옙占쌘울옙.
     * @param 占쏙옙占쏙옙占쏙옙 占쌍소곤옙(占쏙옙占쌜곤옙).
     * @param 占쏙옙占쏙옙占쏙옙 占쌍대값(占쏙옙占쌜곤옙).
     * @return 占쏙옙占쏙옙占쏙옙 占쏙옙'占쏙옙 占쏙옙占쏙옙占싹몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean betweenVal(
            String data,
            String lowerData,
            String upperData) {
        return ((lowerData.length() < data.length()) && (data.length() < upperData.length()));
    }

    /**
     * <p>
     * 占쏙옙占쌘울옙占쏙옙 Null占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return Null占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNull(String data) {
        return (data == null || data.equals(null));
    }

    /**
     * <p>
     * 占쏙옙占쌘울옙占쏙옙 f占쏙옙(0)占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return f占쏙옙(0)占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isZero(String data) {
        return (data.equals("0"));
    }

    /**
     * <p>
     * 占쏙옙占쌘울옙占쏙옙 占쏙옙占쏙옙獵占쏙옙占� 占쏙옙占싱곤옙 f占쏙옙(0)占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return 占쏙옙占쏙옙 占쏙옙占쏙옙占�占쏙옙, f占쏙옙(0)占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isBlank(String data) {

        if (data == null)
            return true;
        else
            return (data.equals(""));
    }

    /**
     * <p>
     * 占쏙옙占쌘울옙占쏙옙 Null 占실댐옙 占쏙옙占쏙옙占쏙옙占�확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return 占쏙옙占쏙옙 占쏙옙占쏙옙斂킬占�Null占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNoData(String data) {
        return (data == null || data.length() == 0);
    }

    /**
     * <p>
     * 占쏙옙占쏙옙 占쏙옙占쏙옙占쏘가 f占쏙옙占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占싶곤옙체.
     * @return 占쏙옙占쏙옙占쏘가 f占쏙옙占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNoData(Vector data) {
        return (data.size() == 0);
    }

    /**
     * <p>
     * ArrayList 占쏙옙占쏙옙占쏘가 f占쏙옙占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�ArrayList 占쏙옙체.
     * @return 占쏙옙占쏙옙占쏘가 f占쏙옙占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNoData(ArrayList data) {
        return (data.size() == 0);
    }

    /**
     * <p>
     * 占쏙옙체占쏙옙 Null占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙체.
     * @return Null占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNoData(Object data) {
        return (data == null);
    }

    /**
     * <p>
     * 占썼열占쏙옙占싱곤옙 f占쏙옙(0)占쏙옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙체.
     * @return f占쏙옙(0)占싱몌옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isNoData(Object[] data) {
        return (data.length == 0);
    }

    /**
     * <p>
     * 占쏙옙트占쏙옙占쏙옙 占쏙옙占쌘로몌옙 占싱뤄옙占� 占쌍댐옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return 占쏙옙占쏙옙占쏙옙 占쏙옙占쌘로몌옙 占실억옙占쏙옙8占쏙옙 TRUE, 占싣니몌옙 FALSE.
     */
    public final static boolean isAlphaNumeric(String text) {

        if (text == null)
            return false;

        int size = text.length();
        for (int i = 0; i < size; i++) {
            if (!Character.isDigit(text.charAt(i)))
                return false;
        }
        return true;
    }

    /**
     * <p>
     * E-mail占쌍소곤옙 占시바몌옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙.
     * @return 占쏙옙8占쏙옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isEmailAddr(String data) {

        if (data == null)
            return false;

        if (data.indexOf("@") == -1)
            return false;

        return true;
    }

    /**
     * <p>
     * 占쌍민듸옙球占싫ｏ옙占�占시바몌옙占쏙옙 확占쏙옙
     * </p>
     *
     * @param 占쏙옙占�占쏙옙占쌘울옙 1.
     * @param 占쏙옙占�占쏙옙占쌘울옙 2.
     * @return 占쏙옙8占쏙옙 TRUE, 占싣니몌옙 FALSE.
     */
    public static boolean isSSN(String serial1, String serial2) {

        if (serial1.length() != 6) {
            return false;
        } else if (serial2.length() != 7) {
            return false;
        } else {
            int digit = 0;
            for (int i = 0; i < serial1.length(); i++) {
                String str_dig = serial1.substring(i, i + 1);
                if (str_dig.length() < 0 || str_dig.length() > 9) {
                    digit = digit + 1;
                }
            }

            if (serial1.equals("") || digit != 0) {
                return false;
            }

            int digit1 = 0;
            for (int i = 0; i < serial2.length(); i++) {
                String str_dig1 = serial2.substring(i, i + 1);
                if (str_dig1.length() < 0 || str_dig1.length() > 9) {
                    digit1 = digit1 + 1;
                }
            }

            if ((serial2 == "") || (digit1 != 0)) {
                return false;
            }

            if (Integer.parseInt(serial1.substring(2, 3)) > 1) {
                return false;
            }

            if (Integer.parseInt(serial1.substring(4, 5)) > 3) {
                return false;
            }

            if (Integer.parseInt(serial2.substring(0, 1)) > 4 || Integer.parseInt(serial2.substring(
                    0, 1)) == 0) {
                return false;
            }

            int a1 = Integer.parseInt(serial1.substring(0, 1));
            int a2 = Integer.parseInt(serial1.substring(1, 2));
            int a3 = Integer.parseInt(serial1.substring(2, 3));
            int a4 = Integer.parseInt(serial1.substring(3, 4));
            int a5 = Integer.parseInt(serial1.substring(4, 5));
            int a6 = Integer.parseInt(serial1.substring(5, 6));

            int check_digit1 = a1 * 2 + a2 * 3 + a3 * 4 + a4 * 5 + a5 * 6 + a6 * 7;

            int b1 = Integer.parseInt(serial2.substring(0, 1));
            int b2 = Integer.parseInt(serial2.substring(1, 2));
            int b3 = Integer.parseInt(serial2.substring(2, 3));
            int b4 = Integer.parseInt(serial2.substring(3, 4));
            int b5 = Integer.parseInt(serial2.substring(4, 5));
            int b6 = Integer.parseInt(serial2.substring(5, 6));
            int b7 = Integer.parseInt(serial2.substring(6, 7));

            int check_digit = check_digit1 + b1 * 8 + b2 * 9 + b3 * 2 + b4 * 3 + b5 * 4 + b6 * 5;

            check_digit = check_digit % 11;
            check_digit = 11 - check_digit;
            check_digit = check_digit % 10;

            if (check_digit != b7) {
                return false;
            } else {
                return true;
            }
        }
    }

}
