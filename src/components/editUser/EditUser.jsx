import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./EditUser.scss";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useStore from "../../store/useStore";

const EditUserCm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { handleEditClose, addUser, checkUserExists, openEdit } = useStore(
    (state) => ({
      handleEditClose: state.handleEditClose,
      addUser: state.addUser,
      checkUserExists: state.checkUserExists,
      openEdit: state.openEdit,
    })
  );
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      userName: "",
      passWord: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .required(t("validation.usernameRequired"))
        .matches(/^[a-zA-Z0-9]+$/, t("validation.usernameAlphanumeric")),
      passWord: Yup.string()
        .required(t("validation.passwordRequired"))
        .min(8, t("validation.passwordMinLength"))
        .matches(/[A-Z]/, t("validation.passwordUppercase"))
        .matches(/[a-z]/, t("validation.passwordLowercase"))
        .matches(/[0-9]/, t("validation.passwordNumber"))
        .matches(/[@$!%*?&]/, t("validation.passwordSpecialCharacter")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userExists = await checkUserExists(values.userName);
        if (userExists) {
          enqueueSnackbar(t("users.usernameExists"), { variant: "warning" });
          return;
        }

        await addUser(values);
        enqueueSnackbar(t("users.addSucces"), { variant: "success" });
        handleEditClose();
      } catch (error) {
        enqueueSnackbar(t("users.addError"), { variant: "error" });
        console.error("Error adding user:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      show={openEdit}
      onHide={handleEditClose}
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit user</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal1">
        <form onSubmit={formik.handleSubmit}>
          <div className="input">
            <TextField
              type="text"
              id="userName"
              name="userName"
              label={t("header.username")}
              variant="outlined"
              onBlur={formik.handleBlur}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              value={formik.values.userName}
              onChange={formik.handleChange}
              style={{ marginBottom: "20px", width: "80%" }}
            />
            <span className="err">
              {formik.touched.userName && formik.errors.userName}
            </span>
          </div>
          <div className="input">
            <TextField
              type="password"
              id="passWord"
              name="passWord"
              label={t("header.password")}
              variant="outlined"
              onBlur={formik.handleBlur}
              error={formik.touched.passWord && Boolean(formik.errors.passWord)}
              value={formik.values.passWord}
              onChange={formik.handleChange}
              style={{ marginBottom: "20px", width: "80%" }}
            />
            <span className="err">
              {formik.touched.passWord && formik.errors.passWord}
            </span>
          </div>
          <div className="line"></div>
          <div className="add_footer">
            <Button variant="text" onClick={handleEditClose} className="btn1">
              {t("users.cancel")}
            </Button>
            <Button
              variant="text"
              type="submit"
              className="btn2"
              disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    style={{ marginRight: "6px", color: "white" }}
                  />
                  {t("users.saving")}
                </>
              ) : (
                t("users.save")
              )}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserCm;
