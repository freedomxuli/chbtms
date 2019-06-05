using SmartFramework4v2.Data;
using SmartFramework4v2.Data.SqlServer;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Web.WebExecutor;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Cwdj 的摘要说明
/// </summary>
[CSClass("Cwdj")]
public class Cwdj
{
    #region 收款登记
    /// <summary>
    /// 编辑收款登记
    /// </summary>
    /// <returns></returns>
    [CSMethod("AddInCome")]
    public object AddInCome(string incomeid, JSReader jsr)
    {
        using (var dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                string companyid = SystemUser.CurrentUser.CompanyID;
                string userid = SystemUser.CurrentUser.UserID;
                DateTime nowTime = DateTime.Now;

                //是否是收入
                string sql = "select * from caiwu_income_item where id=" + dbc.ToSqlValue(jsr["itemId"].ToString());
                DataTable itemDt = dbc.ExecuteDataTable(sql);
                int isIncome = Convert.ToInt32(itemDt.Rows[0]["isIncome"]);

                if (string.IsNullOrEmpty(incomeid))
                {
                    decimal lastQCJE = 0m;//最后一期期初金额
                    DateTime lastDate = DateTime.Now;
                    sql = "select id,dateFasheng,moneyFasheng from caiwu_report_riji order by dateFasheng desc";
                    DataTable dt = dbc.ExecuteDataTable(sql);
                    if (dt.Rows.Count > 0)
                    {
                        lastQCJE = Convert.ToDecimal(dt.Rows[0]["moneyFasheng"]);
                        lastDate = Convert.ToDateTime(dt.Rows[0]["dateFasheng"]);
                    }

                    incomeid = Guid.NewGuid().ToString();
                    DataTable indt = dbc.GetEmptyDataTable("caiwu_income");
                    DataRow dr = indt.NewRow();
                    dr["id"] = incomeid;
                    dr["isLock"] = 1;
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["incomeDate"] = jsr["incomeDate"].ToString();
                    dr["itemId"] = jsr["itemId"].ToString();
                    dr["money"] = jsr["money"].ToString();
                    dr["memo"] = jsr["memo"].ToString();
                    dr["adduser"] = userid;
                    dr["addtime"] = nowTime;
                    dr["companyId"] = companyid;
                    dr["status"] = 0;
                    indt.Rows.Add(dr);
                    dbc.InsertTable(indt);

                    if (isIncome == 0)
                    {
                        //是收入
                        DataTable rjdt = dbc.GetEmptyDataTable("caiwu_report_riji");
                        DataRow rjdr = rjdt.NewRow();
                        rjdr["id"] = Guid.NewGuid().ToString();
                        rjdr["kind"] = 100;
                        rjdr["officeId"] = jsr["officeId"].ToString();
                        rjdr["incomeId"] = incomeid;
                        rjdr["incomeItemId"] = jsr["itemId"].ToString();
                        rjdr["bank"] = "";
                        rjdr["dateFasheng"] = nowTime;
                        rjdr["moneyFasheng"] = lastQCJE + Convert.ToDecimal(jsr["money"].ToString());//重取值
                        rjdr["memo"] = jsr["memo"].ToString();//重取值
                        rjdr["adduser"] = SystemUser.CurrentUser.UserID;
                        rjdr["addtime"] = DateTime.Now;
                        rjdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                        rjdt.Rows.Add(rjdr);
                        dbc.InsertTable(rjdt);
                    }
                }
                else
                {
                    //变化量
                    sql = "select * from caiwu_income where id=" + dbc.ToSqlValue(incomeid);
                    DataTable oldDt = dbc.ExecuteDataTable(sql);
                    decimal oldMoney = Convert.ToDecimal(oldDt.Rows[0]["money"]);
                    DateTime oldDate = Convert.ToDateTime(oldDt.Rows[0]["incomeDate"]);
                    decimal newMoney = Convert.ToDecimal(jsr["money"].ToString());

                    DataTable indt = dbc.GetEmptyDataTable("caiwu_income");
                    DataTableTracker indtt = new DataTableTracker(indt);
                    DataRow dr = indt.NewRow();
                    dr["id"] = incomeid;
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["incomeDate"] = jsr["incomeDate"].ToString();
                    dr["itemId"] = jsr["itemId"].ToString();
                    dr["money"] = newMoney;
                    dr["memo"] = jsr["memo"].ToString();
                    dr["companyId"] = companyid;
                    dr["status"] = 0;
                    indt.Rows.Add(dr);
                    dbc.UpdateTable(indt, indtt);

                    if (isIncome == 0)
                    {
                        decimal changeMoney = newMoney - oldMoney;
                        sql = @"update caiwu_report_riji set moneyFasheng=moneyFasheng+" + changeMoney + @" 
                    where companyId=" + dbc.ToSqlValue(companyid) + " and dateFasheng>=" + dbc.ToSqlValue(oldDate);
                        dbc.ExecuteNonQuery(sql);
                    }
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

    [CSMethod("DelIncome")]
    public void DelIncome(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                //变化量
                string sql = "select * from caiwu_income where id=" + dbc.ToSqlValue(id);
                DataTable oldDt = dbc.ExecuteDataTable(sql);
                decimal oldMoney = Convert.ToDecimal(oldDt.Rows[0]["money"]);
                DateTime oldDate = Convert.ToDateTime(oldDt.Rows[0]["incomeDate"]);

                sql = @"update caiwu_income set status=1 where id=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);

                //是否是收入
                sql = "select * from caiwu_income_item where id=" + dbc.ToSqlValue(oldDt.Rows[0]["itemId"].ToString());
                DataTable itemDt = dbc.ExecuteDataTable(sql);
                int isIncome = Convert.ToInt32(itemDt.Rows[0]["isIncome"]);

                if (isIncome == 0)
                {
                    sql = @"update caiwu_report_riji set moneyFasheng=moneyFasheng-" + oldMoney + @" 
where companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and dateFasheng>=" + dbc.ToSqlValue(oldDate);
                    dbc.ExecuteNonQuery(sql);
                    dbc.CommitTransaction();
                }

            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw;
            }
        }
    }

    [CSMethod("GetIncomeByPage")]
    public object GetIncomeByPage(int pagnum, int pagesize, string officeid, string itemid, string START_TIME, string END_TIME)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                try
                {
                    int cp = pagnum;
                    int ac = 0;

                    string where = "";

                    if (!string.IsNullOrEmpty(officeid))
                    {
                        where += " and a.officeId=" + dbc.ToSqlValue(officeid);
                    }
                    if (!string.IsNullOrEmpty(itemid))
                    {
                        where += " and a.itemId=" + dbc.ToSqlValue(itemid);
                    }
                    if (!string.IsNullOrEmpty(START_TIME))
                    {
                        where += " and a.incomeDate >= " + dbc.ToSqlValue(Convert.ToDateTime(START_TIME));
                    }
                    if (!string.IsNullOrEmpty(END_TIME))
                    {
                        where += " and a.incomeDate <= " + dbc.ToSqlValue(Convert.ToDateTime(END_TIME));
                    }

                    string sql = @"select a.*,b.officeName,c.itemName from dbo.caiwu_income a
                                    left join dbo.jichu_office b on a.officeId=b.officeId
                                    inner join dbo.caiwu_income_item c on a.itemId=c.id 
                                    where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + where;

                    DataTable dt = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                    return new { dt = dt, cp = cp, ac = ac };
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetIncomeByID")]
    public object GetIncomeByID(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from dbo.caiwu_income where id=@id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@id", id);
                DataTable dt = dbc.ExecuteDataTable(cmd);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion

    #region 支出款登记
    /// <summary>
    /// 编辑支出款登记
    /// </summary>
    /// <returns></returns>
    [CSMethod("AddExpense")]
    public object AddExpense(string expenseid, JSReader jsr)
    {
        using (var dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                string companyid = SystemUser.CurrentUser.CompanyID;
                string userid = SystemUser.CurrentUser.UserID;
                DateTime nowTime = DateTime.Now;

                //是否是成本
                string sql = "select * from caiwu_expense_item where id=" + dbc.ToSqlValue(jsr["itemId"].ToString());
                DataTable itemDt = dbc.ExecuteDataTable(sql);
                int isChengben = Convert.ToInt32(itemDt.Rows[0]["isChengben"]);

                if (string.IsNullOrEmpty(expenseid))
                {
                    decimal lastQCJE = 0m;//最后一期期初金额
                    DateTime lastDate = DateTime.Now;
                    sql = "select id,dateFasheng,moneyFasheng from caiwu_report_riji order by dateFasheng desc";
                    DataTable dt = dbc.ExecuteDataTable(sql);
                    if (dt.Rows.Count > 0)
                    {
                        lastQCJE = Convert.ToDecimal(dt.Rows[0]["moneyFasheng"]);
                        lastDate = Convert.ToDateTime(dt.Rows[0]["dateFasheng"]);
                    }

                    expenseid = Guid.NewGuid().ToString();
                    DataTable indt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataRow dr = indt.NewRow();
                    dr["id"] = expenseid;
                    dr["isLock"] = 1;
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["expenseDate"] = jsr["expenseDate"].ToString();
                    dr["itemId"] = jsr["itemId"].ToString();
                    dr["money"] = jsr["money"].ToString();
                    dr["memo"] = jsr["memo"].ToString();
                    dr["adduser"] = userid;
                    dr["addtime"] = nowTime;
                    dr["companyId"] = companyid;
                    dr["status"] = 0;
                    indt.Rows.Add(dr);
                    dbc.InsertTable(indt);

                    if (isChengben == 0)
                    {
                        DataTable rjdt = dbc.GetEmptyDataTable("caiwu_report_riji");
                        DataRow rjdr = rjdt.NewRow();
                        rjdr["id"] = Guid.NewGuid().ToString();
                        rjdr["kind"] = 200;
                        rjdr["officeId"] = jsr["officeId"].ToString();
                        rjdr["expenseId"] = expenseid;
                        rjdr["expenseItemId"] = jsr["itemId"].ToString();
                        rjdr["bank"] = "";
                        rjdr["dateFasheng"] = nowTime;
                        rjdr["moneyFasheng"] = lastQCJE - Convert.ToDecimal(jsr["money"].ToString());//重取值
                        rjdr["memo"] = jsr["memo"].ToString();//重取值
                        rjdr["adduser"] = SystemUser.CurrentUser.UserID;
                        rjdr["addtime"] = DateTime.Now;
                        rjdr["companyId"] = SystemUser.CurrentUser.CompanyID;
                        rjdt.Rows.Add(rjdr);
                        dbc.InsertTable(rjdt);
                    }
                }
                else
                {
                    //变化量
                    sql = "select * from caiwu_expense where id=" + dbc.ToSqlValue(expenseid);
                    DataTable oldDt = dbc.ExecuteDataTable(sql);
                    decimal oldMoney = Convert.ToDecimal(oldDt.Rows[0]["money"]);
                    DateTime oldDate = Convert.ToDateTime(oldDt.Rows[0]["expenseDate"]);
                    decimal newMoney = Convert.ToDecimal(jsr["money"].ToString());

                    DataTable indt = dbc.GetEmptyDataTable("caiwu_expense");
                    DataTableTracker indtt = new DataTableTracker(indt);
                    DataRow dr = indt.NewRow();
                    dr["id"] = expenseid;
                    dr["officeId"] = jsr["officeId"].ToString();
                    dr["expenseDate"] = jsr["expenseDate"].ToString();
                    dr["itemId"] = jsr["itemId"].ToString();
                    dr["money"] = newMoney;
                    dr["memo"] = jsr["memo"].ToString();
                    dr["companyId"] = companyid;
                    dr["status"] = 0;
                    indt.Rows.Add(dr);
                    dbc.UpdateTable(indt, indtt);

                    if (isChengben == 0)
                    {
                        decimal changeMoney = newMoney - oldMoney;
                        sql = @"update caiwu_report_riji set moneyFasheng=moneyFasheng-" + changeMoney + @" 
where companyId=" + dbc.ToSqlValue(companyid) + " and dateFasheng>=" + dbc.ToSqlValue(oldDate);
                        dbc.ExecuteNonQuery(sql);
                    }
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

    [CSMethod("DelExpense")]
    public void DelExpense(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                dbc.BeginTransaction();
                //变化量
                string sql = "select * from caiwu_expense where id=" + dbc.ToSqlValue(id);
                DataTable oldDt = dbc.ExecuteDataTable(sql);
                decimal oldMoney = Convert.ToDecimal(oldDt.Rows[0]["money"]);
                DateTime oldDate = Convert.ToDateTime(oldDt.Rows[0]["expenseDate"]);

                sql = @"update caiwu_expense set status=1 where id=" + dbc.ToSqlValue(id);
                dbc.ExecuteNonQuery(sql);

                //是否是成本
                sql = "select * from caiwu_expense_item where id=" + dbc.ToSqlValue(oldDt.Rows[0]["itemId"].ToString());
                DataTable itemDt = dbc.ExecuteDataTable(sql);
                int isChengben = Convert.ToInt32(itemDt.Rows[0]["isChengben"]);

                if (isChengben == 0)
                {
                    sql = @"update caiwu_report_riji set moneyFasheng=moneyFasheng+" + oldMoney + @" 
where companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + " and dateFasheng>=" + dbc.ToSqlValue(oldDate);
                    dbc.ExecuteNonQuery(sql);
                    dbc.CommitTransaction();
                }
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetExpenseByPage")]
    public object GetExpenseByPage(int pagnum, int pagesize, string officeid, string itemid, string START_TIME, string END_TIME)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                try
                {
                    int cp = pagnum;
                    int ac = 0;

                    string where = "";

                    if (!string.IsNullOrEmpty(officeid))
                    {
                        where += " and a.officeId=" + dbc.ToSqlValue(officeid);
                    }
                    if (!string.IsNullOrEmpty(itemid))
                    {
                        where += " and a.itemId=" + dbc.ToSqlValue(itemid);
                    }
                    if (!string.IsNullOrEmpty(START_TIME))
                    {
                        where += " and a.expenseDate >= " + dbc.ToSqlValue(Convert.ToDateTime(START_TIME));
                    }
                    if (!string.IsNullOrEmpty(END_TIME))
                    {
                        where += " and a.expenseDate <= " + dbc.ToSqlValue(Convert.ToDateTime(END_TIME));
                    }

                    string sql = @"select a.*,b.officeName,c.itemName from dbo.caiwu_expense a
                                    left join dbo.jichu_office b on a.officeId=b.officeId
                                    inner join dbo.caiwu_expense_item c on a.itemId=c.id 
                                    where a.status=0 and a.companyId=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID) + where;

                    DataTable dt = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);
                    return new { dt = dt, cp = cp, ac = ac };
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetExpenseByID")]
    public object GetExpenseByID(string id)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = @"select * from dbo.caiwu_expense where id=@id";
                SqlCommand cmd = new SqlCommand(str);
                cmd.Parameters.AddWithValue("@id", id);
                DataTable dt = dbc.ExecuteDataTable(cmd);

                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion
}