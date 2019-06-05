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
///KHMag 的摘要说明
/// </summary>
[CSClass("KHMag")]
public class KHMag
{
    public KHMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    /// <summary>
    /// 获取业务员列表
    /// </summary>
    /// <param name="pagnum"></param>
    /// <param name="pagesize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    [CSMethod("GetKHList")]
    public object GetKHList(int pagnum, int pagesize, string keyword)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                string where = "";
                if (!string.IsNullOrEmpty(keyword.Trim()))
                {
                    where += " and (" + dbc.C_Like("a.people", keyword.Trim(), LikeStyle.LeftAndRightLike)
                          + " or " + dbc.C_Like("a.peopleCode", keyword.Trim(), LikeStyle.LeftAndRightLike) + ")";
                }
                string str = @" select a.*,case when b.yhyds is null then 0 else b.yhyds end as yhyds,c.officeName from jichu_client a left join
                              (select count(yundan_id) as yhyds,clientId from yundan_yundan where  status=0 group by clientId) b 
                              on a.clientId=b.clientId 
                               left join jichu_office c on a.officeId=c.officeId
                                where a.status=0 " + where + " and a.companyId='" + SystemUser.CurrentUser.CompanyID + "' order by addtime desc";
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

    /// <summary>
    /// 根据ID获取客户
    /// </summary>
    /// <param name="officeid"></param>
    /// <returns></returns>
    [CSMethod("GetKHById")]
    public object GetKHById(string clientId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_client  where clientId=@clientId";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@clientId", clientId);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 根据客户名称判断是否存在
    /// </summary>
    /// <param name="clientName"></param>
    /// <returns></returns>
    [CSMethod("GetKHByName")]
    public object GetKHByName(string clientName)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_client where companyId=@companyId and people=@people";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@companyId", SystemUser.CurrentUser.CompanyID);
                cmd.Parameters.AddWithValue("@people", clientName);
                DataTable dt = dbc.ExecuteDataTable(cmd);
                if (dt.Rows.Count > 0)
                {
                    return new { fahuoId = dt.Rows[0]["clientId"].ToString(), fahuoTel = dt.Rows[0]["tel"].ToString(), faAddress = dt.Rows[0]["address"].ToString() };
                }
                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    /// <summary>
    /// 新增编辑业务员
    /// </summary>
    /// <param name="jsr"></param>
    /// <returns></returns>
    [CSMethod("SaveKH")]
    public object SaveKH(JSReader jsr)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string people = jsr["people"];
                if (string.IsNullOrEmpty(people))
                {
                    throw new Exception("客户名称不能为空！");
                }

                if (jsr["clientId"].ToString() == "")
                {
                    //新增
                    string clientId = Guid.NewGuid().ToString();

                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["people"] = people;
                    dr["tel"] = jsr["tel"];
                    dr["address"] = jsr["address"];
                    dr["compName"] = jsr["compName"];
                    dr["status"] = 0;
                    dr["addtime"] = DateTime.Now;
                    dr["adduser"] = userid;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dr["companyId"] = SystemUser.CurrentUser.CompanyID;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    //修改
                    string clientId = jsr["clientId"].ToString();
                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["peopleCode"] = jsr["peopleCode"];
                    dr["people"] = people;
                    dr["tel"] = jsr["tel"];
                    dr["address"] = jsr["address"];
                    dr["compName"] = jsr["compName"];
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = userid;
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("DeleteKH")]
    public object DeleteYwy(string clientId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "select * from yundan_yundan where status=0 and clientId=" + dbc.ToSqlValue(clientId);
                DataTable yddt = dbc.ExecuteDataTable(str);

                if (yddt.Rows.Count > 0)
                {
                    throw new Exception("该客户有运单存在，不能删除！");
                }
                else
                {
                    DataTable dt = dbc.GetEmptyDataTable("jichu_client");
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["clientId"] = new Guid(clientId);
                    dr["status"] = 1;
                    dr["updatetime"] = DateTime.Now;
                    dr["updateuser"] = SystemUser.CurrentUser.UserID;
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("CombinKHList")]
    public DataTable CombinKHList(JSReader jsrIds)
    {
        using (DBConnection dbc = new DBConnection())
        {
            List<string> idList = new List<string>();
            var idArray = jsrIds.ToArray();
            foreach (var id in idArray)
            {
                idList.Add(id.ToString());
            }
            var idStr = "'" + string.Join("','", idList.ToArray()) + "'";
            var sqlStr = @"select a.*,case when b.yhyds is null then 0 else b.yhyds end as yhyds,c.officeName from jichu_client a 
                            left join(
                                select count(yundan_id) as yhyds,clientId from yundan_yundan 
                                where  status=0 group by clientId
                            ) b on a.clientId=b.clientId 
                            left join jichu_office c on a.officeId=c.officeId
                            where a.status=0   and " + dbc.C_In("a.clientId", idList.ToArray());
            return dbc.ExecuteDataTable(sqlStr);
        }
    }

    /// <summary>
    /// 客户合并保存
    /// </summary>
    /// <param name="mainid">合并到客户ID</param>
    /// <param name="jsrIds">需要合并的客户</param>
    /// <returns></returns>
    [CSMethod("CombinKH")]
    public bool CombinKH(string mainid, JSReader jsrIds)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();

                List<string> idList = new List<string>();
                var idArray = jsrIds.ToArray();
                foreach (var id in idArray)
                {
                    if (id.ToString() != mainid)
                    {
                        idList.Add(id.ToString());
                    }
                }
                if (idList.Count > 0)
                {
                    List<string> sqllist = new List<string>();//sql语句放集合
                    //1.删除被合并的客户
                    string sql = @"update jichu_client set status=1,updatetime=" + dbc.ToSqlValue(DateTime.Now) + ",updateuser=" + dbc.ToSqlValue(SystemUser.CurrentUser.UserID) + @" 
                            where " + dbc.C_In("clientId", idList.ToArray());
                    sqllist.Add(sql);

                    //2.更新被合并运单表、应收、应付、日记表
                    //需要更改客户ID的表
                    List<string> listTabUp = new List<string>();
                    listTabUp.Add("yundan_yundan");//运单表
                    listTabUp.Add("caiwu_expense");//
                    listTabUp.Add("caiwu_income");//
                    listTabUp.Add("caiwu_report_riji");//
                    foreach (string tabname in listTabUp)
                    {
                        sqllist.Add("update " + tabname + " set clientId=" + dbc.ToSqlValue(mainid) + " where " + dbc.C_In("clientId", idList.ToArray()));
                    }
                    //执行SQL
                    foreach (string sqlhb in sqllist)
                    {
                        dbc.ExecuteNonQuery(sqlhb);
                    }
                    dbc.CommitTransaction();
                    return true;
                }
                else if (idList.Count == 1)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    #region 客户信用授权
    [CSMethod("GetClientSQByPage")]
    public object GetClientSQByPage(int pagnum, int pagesize, string client)
    {
        try
        {
            using (DBConnection dbc = new DBConnection())
            {
                var user = SystemUser.CurrentUser;
                string companyId = user.CompanyID;

                int cp = pagnum;
                int ac = 0;

                #region 拼接查询条件
                List<string> list_where = new List<string>();

                if (!string.IsNullOrEmpty(client))
                {
                    list_where.Add("a.people like '%" + client + "%'");
                }
                #endregion

                string sql = @"select
                                a.clientId,
                                a.people,
                                a.tel,
                                isNULL(b.sumMoney,0)sumMoney,
                                isNULL(c.yhxMoney,0)yhxMoney,
                                (isNULL(b.sumMoney,0)-isNULL(c.yhxMoney,0)) whxMoney,
                                d.grade,
                                case
                                when (d.minlimit IS NULL or d.maxlimit IS null) then '-'
                                else CONVERT(varchar(10),d.minlimit)+'~'+CONVERT(varchar(10),d.maxlimit)
                                end as limit,
                                case 
                                when d.period IS NULL then '-'
                                else CONVERT(varchar(10),d.period)+'天'
                                end as period,
                                d.UserXM sq_people from jichu_client a
                                left join (
	                                select clientId,(SUM(moneyQianfu)+SUM(moneyHuidanfu)) sumMoney from yundan_yundan 
	                                where status=0 and companyId=" + dbc.ToSqlValue(companyId) + @"
	                                group by clientId
                                )b on a.clientId=b.clientId
                                left join(
                                    select clientId,SUM(money) yhxMoney from caiwu_income 
                                    where kind=2 and status=0 and companyId=" + dbc.ToSqlValue(companyId) + @"
                                    group by clientId
                                )c on a.clientId=c.clientId
                                left join (
                                    select t1.*,t2.UserXM from jichu_credit t1
                                    left join tb_b_user t2 on t1.updateuser=t2.UserID
                                    where t1.status=0 and t1.companyId=" + dbc.ToSqlValue(companyId) + @"
                                )d on a.gradeId=d.creditId
                                where a.status=0 and a.companyId=" + dbc.ToSqlValue(companyId);

                if (list_where.Count > 0)
                {
                    sql += " and " + string.Join(" and ", list_where);
                }
                sql += " order by a.addtime asc";
                DataTable dt_return = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                dt_return.Columns.Add("dj");
                foreach (DataRow dr in dt_return.Rows)
                {
                    string djstr = "";//☆★
                    if (dr["grade"] != DBNull.Value)
                    {
                        int dj = Convert.ToInt32(dr["grade"]);
                        int zs = dj / 2;
                        int ys = dj % 2;
                        for (int i = 0; i < zs; i++)
                        {
                            djstr += "★";
                        }
                        for (int i = 0; i < ys; i++)
                        {
                            djstr += "☆";
                        }
                    }
                    else
                    {
                        djstr = "未授权";
                    }
                    dr["DJ"] = djstr;
                }
                return new { dt = dt_return, cp = cp, ac = ac };
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("LoadCredit")]
    public DataTable LoadCredit()
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select creditId,grade from jichu_credit where status=0 order by grade asc";
            DataTable cdt = dbc.ExecuteDataTable(sql);
            cdt.Columns.Add("dj");
            foreach (DataRow dr in cdt.Rows)
            {
                string djstr = "";//☆★
                if (dr["grade"] != DBNull.Value)
                {
                    int dj = Convert.ToInt32(dr["grade"]);
                    int zs = dj / 2;
                    int ys = dj % 2;
                    for (int i = 0; i < zs; i++)
                    {
                        djstr += "★";
                    }
                    for (int i = 0; i < ys; i++)
                    {
                        djstr += "☆";
                    }
                }
                else
                {
                    djstr = "未授权";
                }
                dr["dj"] = djstr;
            }
            return cdt;
        }
    }

    [CSMethod("GetCreditLd")]
    public object GetCreditLd(string creditId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string limit = "";
            string period = "";
            string sql = @"select * from jichu_credit where status=0 ";
            if (!string.IsNullOrEmpty(creditId))
            {
                sql += " and creditId=" + dbc.ToSqlValue(creditId);
            }
            DataTable cdt = dbc.ExecuteDataTable(sql);
            foreach (DataRow dr in cdt.Rows)
            {
                int minlimit = Convert.ToInt32(dr["minlimit"]);
                int maxlimit = Convert.ToInt32(dr["maxlimit"]);


                limit = minlimit + "~" + maxlimit;
                period = Convert.ToInt32(dr["period"]) + "天";
            }
            return new { limit = limit, period = period };
        }
    }

    [CSMethod("GetClientSQById")]
    public string GetClientSQById(string client)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = @"select b.creditId from jichu_client a
left join jichu_credit b on a.gradeId=b.creditId
where a.clientId=" + dbc.ToSqlValue(client);
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                return dt.Rows[0]["creditId"].ToString();
            }
            return "";
        }
    }

    [CSMethod("SaveClientCredit")]
    public void SaveClientCredit(string creditId, string clientId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"update jichu_client set gradeId=" + dbc.ToSqlValue(creditId) + " where clientId=" + dbc.ToSqlValue(clientId);
                dbc.ExecuteNonQuery(sql);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion
}
