import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { setCurrentPage } from "../../features/gig";

import "./Pagination.scss";
import { useAppDispatch } from "../../app/hooks";

import slider from "../../assets/img/icons/slider-button.svg";

type Props = {
  totalPages: number;
  currentPage: number;
};

export const Pagination: React.FC<Props> = ({ totalPages, currentPage }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePageChange = ({ selected }: { selected: number }) => {
    const page = selected + 1;
    const queryParams = new URLSearchParams(location.search);

    dispatch(setCurrentPage(page));

    queryParams.set("page", page.toString());

    navigate({ search: queryParams.toString() });
  };

  return (
    <div className="pagination">
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        forcePage={currentPage - 1}
        previousLabel={
          <div className="pagination__img">
            <img className="pagination__button" src={slider} alt="" />
          </div>
        }
        nextLabel={
          <div className="pagination__img pagination__img_right">
            <img className="pagination__button" src={slider} alt="" />
          </div>
        }
        breakLabel={"..."}
        breakLinkClassName="pagination__paginationBreak"
        containerClassName="pagination__paginationNums"
        pageClassName="pagination__paginationBtn"
        activeClassName="pagination__paginationBtnActive"
        pageLinkClassName="pagination__paginationNum"
        activeLinkClassName="pagination__paginationNumActive"
        onPageChange={handlePageChange}
      />
    </div>
  );
};
