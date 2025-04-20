import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Blog } from "../../components/blog/Blog";
import { ProductSlider } from "../../components/product-slider";
import { useAuthContext } from "../../context/AuthContext";
import { fetchTopGigs } from "../../features/gig";
import { MainScreen } from "../../components/mainscreen";

export const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isAuth } = useAuthContext();
  const { gigsTop } = useAppSelector((state: RootState) => state.gigs);

  const isSeller = localStorage.getItem("isSeller");

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchTopGigs());
    }
  }, [dispatch, isAuth]);

  return (
    <section className="main">
      <div className="main__container">
        <MainScreen />
        {isSeller && isAuth && <ProductSlider gigs={gigsTop} />}
        <Blog />
      </div>
    </section>
  );
};
