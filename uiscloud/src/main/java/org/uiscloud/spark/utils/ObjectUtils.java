package org.uiscloud.spark.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.log4j.Logger;

/**
 * @author theclub
 * 
 */
public class ObjectUtils {

    /**
     * Logger for this class
     */
    private static final Logger logger = Logger.getLogger(ObjectUtils.class);

    /**
     * @param bean
     * @param propertyName
     * @return property 존재 여부
     */
    public static boolean hasProperty(Object bean, String propertyName) {
        try {
            Field field = bean.getClass().getDeclaredField(propertyName);
            if (field != null) {
                return true;
            }
        } catch (SecurityException e) {
            logger.error(propertyName + " : Class is not Security.");
        } catch (NoSuchFieldException e) {
            return false;
        }
        return false;
    }

    /**
     * get object from original object by property name
     * 
     * @param object
     * @param name
     * @return property value
     */
    public static Object getProperty(Object object, String name) {
        try {
            return PropertyUtils.getProperty(object, name);
        } catch (IllegalAccessException e) {
            logger.error(name + " : Class is not accessed.");
        } catch (InvocationTargetException e) {
            logger.error(name + " : Invocation error.");
        } catch (NoSuchMethodException e) {
            logger.error(name + " : Class has no such method.");
        }

        return null;
    }

    /**
     * @param object
     * @return 패키지명
     */
    public static String getPackageName(Object object) {
        return object.getClass().getPackage().getName();
    }

    /**
     * @param object
     * @return 패키지명을 제외한 클래스명
     */
    public static String getClassNameWithoutPackageName(Object object) {
        String packageName = object.getClass().getPackage().getName();
        String className = object.getClass().getName();
        return className.substring(packageName.length() + 1);
    }

    /**
     * @param obj
     * @param methodName
     * @return proper method
     */
    public static Method getMethod(Object obj, String methodName) {
        Method[] methods = obj.getClass().getMethods();
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                return method;
            }
        }

        return null;
    }

}
