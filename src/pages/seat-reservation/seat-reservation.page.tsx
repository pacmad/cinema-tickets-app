import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./seat-reservation.styles.scss";
import { IRootState } from "redux/types";
import { createStructuredSelector } from "reselect";
import {
  ISeatReservationPageMapStateProps,
  ISeatReservationPageMatchParams,
  ISeatReservationPageMapDispatchProps,
} from "./types";
import {
  selectReservationDate,
  selectReservationHour,
  selectSelectedSeatsCount,
} from "redux/reservation/reservation.selectors";
import {
  selectMovie,
  selectMovieTicketPrice,
} from "redux/movies/movies.selectors";
import SeatingPlan from "components/seating-plan/seating-plan.component";
import CustomButton from "components/custom-button/custombutton.component";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { ReservationActionTypes } from "redux/reservation/reservation.types";
import { setReservationMovieId } from "redux/reservation/reservation.actions";
import SeatingPlanLegend from "components/seating-plan-legend/seating-plan-legend.comopnent";
import MovieInfo from "components/movie-info/movie-info.component";
import { fetchMovieBookedSeatsStart } from "redux/movies/movies.actions";

const SeatReservationPage = ({
  date,
  hour,
  movie,
  selectedSeatsCount,
  setReservationMovieId,
  fetchMovieBookedSeatsStart,
  ticketPrice,
  match,
}: RouteComponentProps<ISeatReservationPageMatchParams> &
  ISeatReservationPageMapStateProps &
  ISeatReservationPageMapDispatchProps) => {
  useEffect(() => {
    setReservationMovieId(match.params.movieId);
  }, [setReservationMovieId, match.params.movieId]);

  useEffect(() => {
    fetchMovieBookedSeatsStart(match.params.movieId);
  }, [fetchMovieBookedSeatsStart]);

  const total = selectedSeatsCount
    ? `${(selectedSeatsCount * ticketPrice!).toFixed(2)}$`
    : "";

  return (
    <div className="seat-reservation">
      <MovieInfo movie={movie} date={date} hour={hour} />
      <SeatingPlan />
      <SeatingPlanLegend />
      <CustomButton
        type="button"
        to="/payment"
        block
        disabled={!selectedSeatsCount}
      >
        Pay now {total}
      </CustomButton>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<
  IRootState,
  RouteComponentProps<ISeatReservationPageMatchParams>,
  ISeatReservationPageMapStateProps
>({
  date: selectReservationDate,
  hour: selectReservationHour,
  movie: (state, ownProps) => selectMovie(ownProps.match.params.movieId)(state),
  selectedSeatsCount: selectSelectedSeatsCount,
  ticketPrice: (state, ownProps) =>
    selectMovieTicketPrice(ownProps.match.params.movieId)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ReservationActionTypes>) => ({
  setReservationMovieId: (movieId: string) =>
    dispatch(setReservationMovieId(movieId)),
  fetchMovieBookedSeatsStart: (movieId: string) => dispatch(fetchMovieBookedSeatsStart(movieId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatReservationPage);
