const pool = require("../database/config");

const getAccounts = async ({ id }) => {
  const userAccounts = await pool.query(
    "select distinct on (a.id_account)  a.account_number, a.name, a.id_account, a.balance, c.name as currency, at2.name as account_type from account a join currency c on a.id_currency = c.id_currency  join account_type at2 on a.id_type  = at2.id_type WHERE a.id_user = $1",
    [id]
  );
  if (userAccounts.rowCount === 0) {
    return { answer: "User has no accounts yet" };
  }
  return { answer: "ok", accounts: userAccounts.rows };
};

const addAccount = async (req) => {
  const { accountNumber, name, balance, idCurrency, idUser, idType } = req;
  const accountNumberCheck = await pool.query(
    "SELECT * FROM account WHERE account_number = $1",
    [accountNumber]
  );
  const cashAccountCheck = await pool.query(
    "SELECT * FROM account WHERE id_user = $1 AND account_number = $2 ",
    [idUser, accountNumber]
  );
  if (
    (accountNumberCheck.rowCount !== 0 &&
      (accountNumber !== 0 || idType !== 2)) ||
    cashAccountCheck.rowCount !== 0
  ) {
    return { answer: "invalid account number" };
  }
  const dbRes = await pool.query(
    "INSERT INTO account (account_number, name, balance, id_currency, id_user, id_type) VALUES($1, $2, $3, $4, $5, $6);",
    [accountNumber, name, balance, idCurrency, idUser, idType]
  );
  return { answer: "ok" };
};

const accountUpdate = async (req) => {
  const { accountNumber, name, balance, idCurrency, idType } = req.body;
  const idAccount = req.params.id;
  const idAccountCheck = await pool.query(
    "SELECT * FROM account WHERE id_account = $1 AND account_number = $2",
    [idAccount, accountNumber]
  );
  if (idAccountCheck.rowCount === 0) {
    return { answer: "account doesnt exist here or ir doenst match" };
  }
  const dbRes = await pool.query(
    "UPDATE account SET account_number = $1, name = $2, balance = balance, id_currency = $4, id_type=$5 WHERE id_account = $6;",
    [accountNumber, name, balance, idCurrency, idType, idAccount]
  );
  return { answer: "ok" };
};
const accountDeletion = async (req) => {
  const idAccount = req.params.id;
  const { idUser } = req.body;

  const idAccountCheck = await pool.query(
    "SELECT * FROM account WHERE id_account = $1 AND id_user = $2",
    [idAccount, idUser]
  );

  if (idAccountCheck.rowCount === 0) {
    return { answer: "account doesnt exist here or iduser incorrect" };
  }

  const dbRes = await pool.query("DELETE FROM account WHERE id_account = $1", [
    idAccount,
  ]);
  return { answer: "ok" };
};
const getAccTypes = async (req) => {
  const { rows: account_types } = await pool.query(
    "SELECT * FROM account_type"
  );
  return { answer: "ok", types: account_types };
};
const getCurrency = async (req) => {
  const { rows } = await pool.query("SELECT * FROM currency");
  return { answer: "ok", currency: rows };
};
module.exports = {
  addAccount,
  getAccounts,
  accountUpdate,
  accountDeletion,
  getAccTypes,
  getCurrency,
};
