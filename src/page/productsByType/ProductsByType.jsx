import { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./ProductsByType.scss";
import useTypeStore from "../../store/useTypeStore";
import { useSnackbar } from "notistack";

const ProductsByType = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    products,
    total,
    pageNum,
    rating,
    isEco,
    loading,
    error,
    fetchProducts,
    setRating,
    setIsEco,
    handlePageChange,
    handleFilterSubmit,
  } = useTypeStore((state) => ({
    products: state.products,
    total: state.total,
    pageNum: state.pageNum,
    rating: state.rating,
    isEco: state.isEco,
    loading: state.loading,
    error: state.error,
    fetchProducts: state.fetchProducts,
    setRating: state.setRating,
    setIsEco: state.setIsEco,
    handlePageChange: state.handlePageChange,
    handleFilterSubmit: state.handleFilterSubmit,
  }));

  useEffect(() => {
    fetchProducts();
  }, [pageNum]);

  const handleFilterSubmitClick = () => {
    handleFilterSubmit();
    if (products.length === 0) {
      enqueueSnackbar(t("error.productNotFound"), {
        variant: "error",
        key: "productNotFound",
      });
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <section className="byType">
      <div className="byType_head">
        <h1>{t("filter.goodsType")}</h1>
        <div className="action">
          <FormControl
            variant="standard"
            sx={{ minWidth: 65 }}
            className="rate">
            <InputLabel id="rating-select-label">
              {t("filter.rating")}
            </InputLabel>
            <Select
              labelId="rating-select-label"
              id="rating-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              label={t("filter.rating")}
              sx={{
                textAlign: "center",
                color: "#7000ff",
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#7000ff",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "#7000ff",
                },
              }}>
              {[0, 1, 2, 3, 4, 5].map((rate) => (
                <MenuItem key={rate} value={rate}>
                  {rate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "#7000ff",
                  "& .MuiInput-underline:before": {
                    color: "#7000ff",
                  },
                  "&.MuiInput-underline:hover:before": {
                    color: "#7000ff",
                  },
                }}
                checked={isEco}
                onChange={(e) => setIsEco(e.target.checked)}
              />
            }
            label={t("filter.ecoFriendly")}
          />
          <Button onClick={handleFilterSubmitClick}>{t("filter.apply")}</Button>
        </div>
      </div>

      {loading ? (
        <div className="loadingSpinner">
          <CircularProgress color="primary" className="load" />
        </div>
      ) : (
        <>
          {error && (
            <div className="error">
              <h1>{t("error.fetchError")}</h1>
            </div>
          )}
          {products.length === 0 && !loading && (
            <div className="noProducts">
              <h1>{t("error.productNotFound")}</h1>
            </div>
          )}
          <ul className="byType_body">
            {(products || []).map((product) => (
              <li key={product.id} className="typeCard">
                <Link to={`/single/${product._id}`}>
                  <img src={product.photo} alt={product.category.title} />
                  <div className="typeText">
                    <p>{product.category.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="type_product_footer">
            <span style={{ marginRight: "20px" }}>
              {t("pagination.pageOf", { currentPage: pageNum, totalPages })}
            </span>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={pageNum}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductsByType;
