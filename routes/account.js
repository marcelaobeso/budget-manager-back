const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const {
  getAccountList,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountTypes,
  getCurrencyType,
} = require("../controllers/account.js");
const {
  fieldsValidator,
} = require("../controllers/middlewares/fieldsValidation.js");
const { validateJWT } = require("../controllers/middlewares/JWTValidator.js");
const { getAccTypes } = require("../models/Account.js");

router.get(
  "/accounts",
  validateJWT,
  [check("idUser", "idUser is mandatory ").isNumeric(), fieldsValidator],
  getAccountList
);

router.post(
  "/newAccount",
  validateJWT,
  [
    check("accountNumber", "accountNumber is mandatory").isNumeric(),
    check("name", "origin_account is mandatory").not().isEmpty(),
    check("balance", "balance is mandatory").isNumeric(),
    check("idCurrency", "idCurrency is mandatory").isNumeric(),
    check("idUser", "idUser is mandatory ").isNumeric(),
    check("idType", "idType is mandatory").isNumeric(),
    fieldsValidator,
  ],
  createAccount
);
router.put(
  "/:id",
  validateJWT,
  [
    check("accountNumber", "accountNumber is mandatory").isNumeric(),
    check("name", "origin_account is mandatory").not().isEmpty(),
    check("balance", "balance is mandatory").isNumeric(),
    check("idCurrency", "idCurrency is mandatory").isNumeric(),
    check("idType", "idType is mandatory").isNumeric(),
    fieldsValidator,
  ],
  updateAccount
);
router.delete(
  "/:id",
  validateJWT,
  [check("idUser", "idUser is mandatory").not().isEmpty(), fieldsValidator],
  deleteAccount
);
router.get("/accounttype", validateJWT, getAccountTypes);
router.get("/currencies", validateJWT, getCurrencyType);

module.exports = router;
