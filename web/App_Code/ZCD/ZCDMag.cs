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
///ZCDMag 的摘要说明
/// </summary>
[CSClass("ZCDMag")]
public class ZCDMag
{
    [CSMethod("GetZCDList")]
    public object GetZCDList(int pagnum, int pagesize, string zcdh,string sj,string pz)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(zcdh.Trim()))
                {
                    where += " and " + dbc.C_Like("a.zhuangchedanNum", zcdh.Trim(), LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(sj.Trim()))
                {
                    where += " and " + dbc.C_Like("d.zcdid", sj.Trim(), LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(pz.Trim()))
                {
                    where += " and " + dbc.C_Like("d.carNum", pz.Trim(), LikeStyle.LeftAndRightLike);
                }

                string str = @" select a.*,b.officeName as fromOfficeName,c.officeName as toOfficeName,d.people,d.carNum
                                  from zhuangchedan_zhuangchedan a 
                                  left join jichu_office b on a.officeId=b.officeId
                                  left join jichu_office c on a.officeId=c.officeId 
                                  left join jichu_driver d on a.driverId=d.driverId
                                  where a.status=0 "+where+@"
                                  order by addtime desc";
                //开始取分页数据   
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetZCDQSZ")]
    public DataTable GetZCDQSZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.fromOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    [CSMethod("GetZCDZDZ")]
    public DataTable GetZCDZDZ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @" select distinct c.officeId,c.officeName from jichu_xianlu2user a 
                                  left join jichu_xianlu b on a.traderId=b.traderId
                                  left join jichu_office c on b.toOfficeId=c.officeId
                                  where a.userId='" + SystemUser.CurrentUser.UserID + "' and b.companyId='" + SystemUser.CurrentUser.CompanyID + @"'
                                  and b.status=0  and c.status=0";
                DataTable dt = dbc.ExecuteDataTable(str);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

    [CSMethod("GetDriver")]
    public DataTable GetDriver()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "  select driverId,people,tel,carNum from jichu_driver where  status=0 order by people";
                SqlCommand cmd = new SqlCommand(str);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }

}
