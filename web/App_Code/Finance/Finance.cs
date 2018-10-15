using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SmartFramework4v2.Web.WebExecutor;
using System.Data;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using System.Data.SqlClient;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Data;

/// <summary>
/// Finance 的摘要说明
/// </summary>
[CSClass("Finance")]
public class Finance
{
	public Finance()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}

    [CSMethod("GetYunDanList")]
    public object GetYunDanList(int pagnum, int pagesize, string bsc, string start_time, string end_time, string zcd, string ydh, string isfl)
    {
        using (var db = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(bsc))
                { 
                    
                }
                if (!string.IsNullOrEmpty(start_time) && !string.IsNullOrEmpty(end_time))
                {

                }
                if (!string.IsNullOrEmpty(zcd))
                {

                }
                if (!string.IsNullOrEmpty(ydh))
                {

                }
                if (!string.IsNullOrEmpty(isfl))
                {

                }
                string sql = @"select  from yundan_chaifen a 
                               left join yundan_yundan b on a.yundan_id = b.yundan_id
                               left join zhuangchedan_zhuangchedan c on a.zhuangchedan_id = c.zhuangchedan_id";
                DataTable dt = db.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dt, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}