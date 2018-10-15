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
                string sql = @"select a.id, b.yundanNum,c.zhuangchedanNum,d.people,b.toAddress,b.shouhuoPeople,b.shouhuoTel,b.songhuoType,b.moneyYunfei,b.moneyHuikouXianFan,b.moneyHuikouQianFan,b.memo from yundan_chaifen a 
                               left join yundan_yundan b on a.yundan_id = b.yundan_id
                               left join zhuangchedan_zhuangchedan c on a.zhuangchedan_id = c.zhuangchedan_id
                               left join jichu_driver d on a.driverId = d.driverId";
                DataTable dt = db.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt.Columns.Add("moneyHuiKou");
                dt.Columns.Add("YDJSHF");
                dt.Columns.Add("YDJZZF");
                dt.Columns.Add("YHXSHF");
                dt.Columns.Add("YHXZZF");

                for (var i = 0; i < dt.Rows.Count; i++)
                    dt.Rows[i]["moneyHuiKou"] = Convert.ToDecimal(dt.Rows[i]["moneyHuikouXianFan"].ToString()) + Convert.ToDecimal(dt.Rows[i]["moneyHuikouQianFan"].ToString());

                sql = "select sum(money) shf,fenliuId from yundan_duanbo_fenliu where kind = 1 group by fenliuId";


                return new { dt = dt, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}