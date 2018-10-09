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
}
