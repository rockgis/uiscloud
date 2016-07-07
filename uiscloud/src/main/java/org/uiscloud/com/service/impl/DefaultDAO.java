package org.uiscloud.com.service.impl;

import javax.annotation.Resource;
import com.ibatis.sqlmap.client.SqlMapClient;
import egovframework.rte.psl.dataaccess.EgovAbstractDAO;

public class DefaultDAO extends EgovAbstractDAO {
    /**
     * DB별 sqlMapClient 지정
     */
    @Resource(name = "biesSqlMapClient")
    public void setSuperSqlMapClient(SqlMapClient sqlMapClient) {
        super.setSuperSqlMapClient(sqlMapClient);
    }
}
