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
///PrinterMag 的摘要说明
/// </summary>
[CSClass("PrinterMag")]
public class PrinterMag
{
    public PrinterMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }
    [CSMethod("SavePrint")]
    public object SavePrint(JSReader[] ztlist, JSReader[] printlist, int kind)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                DataTable dt = dbc.GetEmptyDataTable("jichu_print");
                DataTableTracker dtt = new DataTableTracker(dt);
                if (ztlist.Length > 0)
                {
                    for (int i = 0; i < ztlist.Length; i++)
                    {
                        string print_id=Guid.NewGuid().ToString();
                        if (ztlist[i]["print_id"] != null && ztlist[i]["print_id"].ToString() != "")
                        {
                              print_id= ztlist[i]["print_id"].ToString();
                        }

                         DataRow dr = dt.NewRow();
                         dr["print_id"] = print_id;
                         dr["kind"] = kind;
                         if (ztlist[i]["leftBJ"] != null && ztlist[i]["leftBJ"].ToString() != "")
                         {
                             dr["leftBJ"] = Convert.ToInt32(ztlist[i]["leftBJ"].ToString());
                         }
                         if (ztlist[i]["topBJ"] != null && ztlist[i]["topBJ"].ToString() != "")
                         {
                             dr["topBJ"] = Convert.ToInt32(ztlist[i]["topBJ"].ToString());
                         }
                         dr["isWhole"] = 0;
                         dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                         dt.Rows.Add(dr);
                    }
                }

                if (printlist.Length > 0)
                {
                    for (int i = 0; i < printlist.Length; i++)
                    {
                        string print_id = Guid.NewGuid().ToString();
                        if (printlist[i]["print_id"] != null && printlist[i]["print_id"].ToString() != "")
                        {
                            print_id = printlist[i]["print_id"].ToString();
                        }

                        DataRow dr = dt.NewRow();
                        dr["print_id"] = print_id;
                        dr["kind"] = kind;
                        if (printlist[i]["leftBJ"] != null && printlist[i]["leftBJ"].ToString() != "")
                        {
                            dr["leftBJ"] = Convert.ToInt32(printlist[i]["leftBJ"].ToString());
                        }
                        if (printlist[i]["topBJ"] != null && printlist[i]["topBJ"].ToString() != "")
                        {
                            dr["topBJ"] = Convert.ToInt32(printlist[i]["topBJ"].ToString());
                        }
                        if (printlist[i]["fontSize"] != null && printlist[i]["fontSize"].ToString() != "")
                        {
                            dr["fontSize"] = Convert.ToInt32(printlist[i]["fontSize"].ToString());
                        }
                        if (printlist[i]["width"] != null && printlist[i]["width"].ToString() != "")
                        {
                            dr["width"] = Convert.ToInt32(printlist[i]["width"].ToString());
                        }
                        if (printlist[i]["height"] != null && printlist[i]["height"].ToString() != "")
                        {
                            dr["height"] = Convert.ToInt32(printlist[i]["height"].ToString());
                        }
                        dr["isWhole"] = 1;
                        if (printlist[i]["fieldMC"] != null && printlist[i]["fieldMC"].ToString() != "")
                        {
                            dr["fieldMC"] = printlist[i]["fieldMC"].ToString();
                        }
                        if (printlist[i]["fieldName"] != null && printlist[i]["fieldName"].ToString() != "")
                        {
                            dr["fieldName"] = printlist[i]["fieldName"].ToString();
                        }
                        if (printlist[i]["px"] != null && printlist[i]["px"].ToString() != "")
                        {
                            dr["px"] = Convert.ToInt32(printlist[i]["px"].ToString());
                        }
                        dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                        dt.Rows.Add(dr);
                    }
                }
                dbc.InsertOrUpdateTable(dt);
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

    [CSMethod("GetPrintByKind")]
    public object GetPrintByKind(int kind)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_print where iswhole=0 and  kind=" + dbc.ToSqlValue(kind) + " and companyid='" + SystemUser.CurrentUser.CompanyID+"'";
                DataTable ztdt = dbc.ExecuteDataTable(str);

                str = @"select * from jichu_print where iswhole=1 and  kind=" + dbc.ToSqlValue(kind) + " and companyid='" + SystemUser.CurrentUser.CompanyID+"' order by px";
                DataTable printdt = dbc.ExecuteDataTable(str);

                return new { ztdt = ztdt, printdt = printdt };
            }
            catch (Exception ex) {
                throw ex;
            }
        }
    }

    [CSMethod("SavePrint_BQ")]
    public object SavePrint_BQ(JSReader[] ztlist, JSReader[] printlist,  JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "delete from jichu_print where kind=1 and companyid=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                dbc.ExecuteNonQuery(str);

                DataTable dt = dbc.GetEmptyDataTable("jichu_print");
                DataTableTracker dtt = new DataTableTracker(dt);
                if (ztlist.Length > 0)
                {
                    for (int i = 0; i < ztlist.Length; i++)
                    {
                        string print_id = Guid.NewGuid().ToString();

                        DataRow dr = dt.NewRow();
                        dr["print_id"] = print_id;
                        dr["kind"] = 1;
                        if (ztlist[i]["leftBJ"] != null && ztlist[i]["leftBJ"].ToString() != "")
                        {
                            dr["leftBJ"] = Convert.ToInt32(ztlist[i]["leftBJ"].ToString());
                        }
                        if (ztlist[i]["topBJ"] != null && ztlist[i]["topBJ"].ToString() != "")
                        {
                            dr["topBJ"] = Convert.ToInt32(ztlist[i]["topBJ"].ToString());
                        }
                        dr["isWhole"] = 0;
                        dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                        dt.Rows.Add(dr);
                    }
                }

                if (printlist.Length > 0)
                {
                    for (int i = 0; i < printlist.Length; i++)
                    {
                        string print_id = Guid.NewGuid().ToString();

                        DataRow dr = dt.NewRow();
                        dr["print_id"] = print_id;
                        dr["kind"] = 1;
                        if (printlist[i]["leftBJ"] != null && printlist[i]["leftBJ"].ToString() != "")
                        {
                            dr["leftBJ"] = Convert.ToInt32(printlist[i]["leftBJ"].ToString());
                        }
                        if (printlist[i]["topBJ"] != null && printlist[i]["topBJ"].ToString() != "")
                        {
                            dr["topBJ"] = Convert.ToInt32(printlist[i]["topBJ"].ToString());
                        }
                        if (printlist[i]["fontSize"] != null && printlist[i]["fontSize"].ToString() != "")
                        {
                            dr["fontSize"] = Convert.ToInt32(printlist[i]["fontSize"].ToString());
                        }
                        if (printlist[i]["width"] != null && printlist[i]["width"].ToString() != "")
                        {
                            dr["width"] = Convert.ToInt32(printlist[i]["width"].ToString());
                        }
                        if (printlist[i]["height"] != null && printlist[i]["height"].ToString() != "")
                        {
                            dr["height"] = Convert.ToInt32(printlist[i]["height"].ToString());
                        }
                        dr["isWhole"] = 1;
                        if (printlist[i]["fieldMC"] != null && printlist[i]["fieldMC"].ToString() != "")
                        {
                            dr["fieldMC"] = printlist[i]["fieldMC"].ToString();
                        }
                        if (printlist[i]["fieldName"] != null && printlist[i]["fieldName"].ToString() != "")
                        {
                            dr["fieldName"] = printlist[i]["fieldName"].ToString();
                        }
                        if (printlist[i]["px"] != null && printlist[i]["px"].ToString() != "")
                        {
                            dr["px"] = Convert.ToInt32(printlist[i]["px"].ToString());
                        }
                        dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                        dt.Rows.Add(dr);
                    }
                }

                DataRow dr1 = dt.NewRow();
                dr1["print_id"] = Guid.NewGuid().ToString(); ;
                dr1["kind"] = 1;
                if (jsr["sfdygz"] != null && jsr["sfdygz"].ToString() != "")
                {
                    dr1["leftBJ"] = Convert.ToInt32(jsr["sfdygz"].ToString());
                }
                dr1["isWhole"] = 1;
                dr1["fieldMC"] = "是否打印格子";
                dr1["px"] = 7;
                dr1["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr1);

                DataRow dr2 = dt.NewRow();
                dr2["print_id"] = Guid.NewGuid().ToString(); ;
                dr2["kind"] = 1;
                if (jsr["bqgd"] != null && jsr["bqgd"].ToString() != "")
                {
                    dr2["leftBJ"] = Convert.ToInt32(jsr["bqgd"].ToString());
                }
                dr2["isWhole"] = 1;
                dr2["fieldMC"] = "单个标签高度";
                dr2["px"] = 8;
                dr2["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr2);

                DataRow dr3 = dt.NewRow();
                dr3["print_id"] = Guid.NewGuid().ToString(); ;
                dr3["kind"] = 1;
                if (jsr["bqkd"] != null && jsr["bqkd"].ToString() != "")
                {
                    dr3["leftBJ"] = Convert.ToInt32(jsr["bqkd"].ToString());
                }
                dr3["isWhole"] = 1;
                dr3["fieldMC"] = "单个标签宽度";
                dr3["px"] = 9;
                dr3["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr3);

                DataRow dr4 = dt.NewRow();
                dr4["print_id"] = Guid.NewGuid().ToString(); ;
                dr4["kind"] = 1;
                if (jsr["mhdygs"] != null && jsr["mhdygs"].ToString() != "")
                {
                    dr4["leftBJ"] = Convert.ToInt32(jsr["mhdygs"].ToString());
                }
                dr4["isWhole"] = 1;
                dr4["fieldMC"] = "每行打印个数";
                dr4["px"] = 10;
                dr4["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr4);
                

                dbc.InsertTable(dt);
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


    [CSMethod("GetPrintBQ")]
    public object GetPrintBQ()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_print where iswhole=0 and  kind=1 and companyid='" + SystemUser.CurrentUser.CompanyID + "'";
                DataTable ztdt = dbc.ExecuteDataTable(str);

                str = @"select top 6 * from jichu_print where iswhole=1 and  kind=1 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px";
                DataTable printdt = dbc.ExecuteDataTable(str);

                str = @"select * from jichu_print where iswhole=1 and  kind=1 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px desc";
                DataTable dt = dbc.ExecuteDataTable(str);
                var sfdygz = 1;
                DataRow[] drs1 = dt.Select("fieldMC like '%是否打印格子%'");
                if (drs1.Length > 0)
                {
                    if (drs1[0]["leftBJ"] != null && drs1[0]["leftBJ"].ToString() != "")
                    {
                        sfdygz = Convert.ToInt32(drs1[0]["leftBJ"].ToString());
                    }
                }

                var dygd = 0;
                DataRow[] drs2 = dt.Select("fieldMC like '%单个标签高度%'");
                if (drs2.Length > 0)
                {
                    if (drs2[0]["leftBJ"] != null && drs2[0]["leftBJ"].ToString() != "")
                    {
                        dygd = Convert.ToInt32(drs2[0]["leftBJ"].ToString());
                    }
                }

                var dykd = 0;
                DataRow[] drs3 = dt.Select("fieldMC like '%单个标签宽度%'");
                if (drs3.Length > 0)
                {
                    if (drs3[0]["leftBJ"] != null && drs3[0]["leftBJ"].ToString() != "")
                    {
                        dykd = Convert.ToInt32(drs3[0]["leftBJ"].ToString());
                    }
                }

                var mhdygs = 0;
                DataRow[] drs4 = dt.Select("fieldMC like '%每行打印个数%'");
                if (drs4.Length > 0)
                {
                    if (drs4[0]["leftBJ"] != null && drs4[0]["leftBJ"].ToString() != "")
                    {
                        mhdygs = Convert.ToInt32(drs4[0]["leftBJ"].ToString());
                    }
                }


                return new { ztdt = ztdt, printdt = printdt, sfdygz = sfdygz, dygd = dygd, dykd = dykd, mhdygs = mhdygs };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SavePrint_YD")]
    public object SavePrint_YD(JSReader[] ztlist, JSReader[] printlist, JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string str = "delete from jichu_print where kind=2 and companyid=" + dbc.ToSqlValue(SystemUser.CurrentUser.CompanyID);
                dbc.ExecuteNonQuery(str);

                DataTable dt = dbc.GetEmptyDataTable("jichu_print");
                DataTableTracker dtt = new DataTableTracker(dt);
                if (ztlist.Length > 0)
                {
                    for (int i = 0; i < ztlist.Length; i++)
                    {
                        string print_id = Guid.NewGuid().ToString();

                        DataRow dr = dt.NewRow();
                        dr["print_id"] = print_id;
                        dr["kind"] = 2;
                        if (ztlist[i]["leftBJ"] != null && ztlist[i]["leftBJ"].ToString() != "")
                        {
                            dr["leftBJ"] = Convert.ToInt32(ztlist[i]["leftBJ"].ToString());
                        }
                        if (ztlist[i]["topBJ"] != null && ztlist[i]["topBJ"].ToString() != "")
                        {
                            dr["topBJ"] = Convert.ToInt32(ztlist[i]["topBJ"].ToString());
                        }
                        dr["isWhole"] = 0;
                        dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                        dt.Rows.Add(dr);
                    }
                }

                if (printlist.Length > 0)
                {
                    for (int i = 0; i < printlist.Length; i++)
                    {
                        string print_id = Guid.NewGuid().ToString();

                        DataRow dr = dt.NewRow();
                        dr["print_id"] = print_id;
                        dr["kind"] = 2;
                        if (printlist[i]["leftBJ"] != null && printlist[i]["leftBJ"].ToString() != "")
                        {
                            dr["leftBJ"] = Convert.ToInt32(printlist[i]["leftBJ"].ToString());
                        }
                        if (printlist[i]["topBJ"] != null && printlist[i]["topBJ"].ToString() != "")
                        {
                            dr["topBJ"] = Convert.ToInt32(printlist[i]["topBJ"].ToString());
                        }
                        if (printlist[i]["fontSize"] != null && printlist[i]["fontSize"].ToString() != "")
                        {
                            dr["fontSize"] = Convert.ToInt32(printlist[i]["fontSize"].ToString());
                        }
                        if (printlist[i]["width"] != null && printlist[i]["width"].ToString() != "")
                        {
                            dr["width"] = Convert.ToInt32(printlist[i]["width"].ToString());
                        }
                        if (printlist[i]["height"] != null && printlist[i]["height"].ToString() != "")
                        {
                            dr["height"] = Convert.ToInt32(printlist[i]["height"].ToString());
                        }
                        dr["isWhole"] = 1;
                        if (printlist[i]["fieldMC"] != null && printlist[i]["fieldMC"].ToString() != "")
                        {
                            dr["fieldMC"] = printlist[i]["fieldMC"].ToString();
                        }
                        if (printlist[i]["fieldName"] != null && printlist[i]["fieldName"].ToString() != "")
                        {
                            dr["fieldName"] = printlist[i]["fieldName"].ToString();
                        }
                        if (printlist[i]["px"] != null && printlist[i]["px"].ToString() != "")
                        {
                            dr["px"] = Convert.ToInt32(printlist[i]["px"].ToString());
                        }
                        dr["companyid"] = SystemUser.CurrentUser.CompanyID;
                        dt.Rows.Add(dr);
                    }
                }

                DataRow dr1 = dt.NewRow();
                dr1["print_id"] = Guid.NewGuid().ToString(); ;
                dr1["kind"] = 2;
                if (jsr["psfs"] != null && jsr["psfs"].ToString() != "")
                {
                    dr1["leftBJ"] = Convert.ToInt32(jsr["psfs"].ToString());
                }
                dr1["isWhole"] = 1;
                dr1["fieldMC"] = "配送方式显示文字";
                dr1["px"] = 38;
                dr1["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr1);

                DataRow dr2 = dt.NewRow();
                dr2["print_id"] = Guid.NewGuid().ToString(); ;
                dr2["kind"] = 2;
                if (jsr["jsfs"] != null && jsr["jsfs"].ToString() != "")
                {
                    dr2["leftBJ"] = Convert.ToInt32(jsr["jsfs"].ToString());
                }
                dr2["isWhole"] = 1;
                dr2["fieldMC"] = "结算方式显示文字";
                dr2["px"] = 39;
                dr2["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr2);

                DataRow dr3 = dt.NewRow();
                dr3["print_id"] = Guid.NewGuid().ToString(); ;
                dr3["kind"] = 2;
                if (jsr["yfdx"] != null && jsr["yfdx"].ToString() != "")
                {
                    dr3["leftBJ"] = Convert.ToInt32(jsr["yfdx"].ToString());
                }
                dr3["isWhole"] = 1;
                dr3["fieldMC"] = "运费大写显示文字";
                dr3["px"] = 40;
                dr3["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr3);

                DataRow dr4 = dt.NewRow();
                dr4["print_id"] = Guid.NewGuid().ToString(); ;
                dr4["kind"] = 2;
                if (jsr["rq"] != null && jsr["rq"].ToString() != "")
                {
                    dr4["leftBJ"] = Convert.ToInt32(jsr["rq"].ToString());
                }
                dr4["isWhole"] = 1;
                dr4["fieldMC"] = "日期显示文字";
                dr4["px"] = 41;
                dr4["companyid"] = SystemUser.CurrentUser.CompanyID;
                dt.Rows.Add(dr4);


                dbc.InsertTable(dt);
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

    [CSMethod("GetPrintYD")]
    public object GetPrintYD()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string str = "select * from jichu_print where iswhole=0 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "'";
                DataTable ztdt = dbc.ExecuteDataTable(str);

                str = @"select top 37 * from jichu_print where iswhole=1 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px";
                DataTable printdt = dbc.ExecuteDataTable(str);

                str = @"select * from jichu_print where iswhole=1 and  kind=2 and companyid='" + SystemUser.CurrentUser.CompanyID + "' order by px desc";
                DataTable dt = dbc.ExecuteDataTable(str);
                var psfs = 1;
                DataRow[] drs1 = dt.Select("fieldMC like '%配送方式显示文字%'");
                if (drs1.Length > 0)
                {
                    if (drs1[0]["leftBJ"] != null && drs1[0]["leftBJ"].ToString() != "")
                    {
                        psfs = Convert.ToInt32(drs1[0]["leftBJ"].ToString());
                    }
                }

                var jsfs = 0;
                DataRow[] drs2 = dt.Select("fieldMC like '%结算方式显示文字%'");
                if (drs2.Length > 0)
                {
                    if (drs2[0]["leftBJ"] != null && drs2[0]["leftBJ"].ToString() != "")
                    {
                        jsfs = Convert.ToInt32(drs2[0]["leftBJ"].ToString());
                    }
                }

                var yfdx = 0;
                DataRow[] drs3 = dt.Select("fieldMC like '%运费大写显示文字%'");
                if (drs3.Length > 0)
                {
                    if (drs3[0]["leftBJ"] != null && drs3[0]["leftBJ"].ToString() != "")
                    {
                        yfdx = Convert.ToInt32(drs3[0]["leftBJ"].ToString());
                    }
                }

                var rq = 0;
                DataRow[] drs4 = dt.Select("fieldMC like '%日期显示文字%'");
                if (drs4.Length > 0)
                {
                    if (drs4[0]["leftBJ"] != null && drs4[0]["leftBJ"].ToString() != "")
                    {
                        rq = Convert.ToInt32(drs4[0]["leftBJ"].ToString());
                    }
                }


                return new { ztdt = ztdt, printdt = printdt, psfs = psfs, jsfs = jsfs, yfdx = yfdx, rq = rq };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
