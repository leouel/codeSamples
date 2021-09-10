import React, { Fragment, useEffect, useState } from "react";
import "./ListingStylings.css";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Button,
  TextField,
  Checkbox,
  Grid,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Table,
  TableBody,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";
import * as listingPropTypes from "./ListingPropTypes";
import debug from "sabio-debug";
const _logger = debug.extend("ListingReservation");

const useStyles = makeStyles({
  table: {
    minWidth: 150,
  },
});

const ListingReservation = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [listing] = useState(props.details);
  const [formData, setFormData] = useState({
    listingId: listing.id,
    dateCheckedIn: listing.checkInTime,
    dateCheckedOut: listing.checkOutTime,
    statusId: listing.statusId,
    listCostTypeId: 0,
    listCost: 0,
    additionalServices: [],
  });
  const [cartTotal, setCartTotal] = useState({
    totalListCost: 0,
    totalExtraServiceCost: 0,
    totalCost: 0,
    totalHours:
      Math.abs(
        new Date(listing.checkOutTime).getTime() -
          new Date(listing.checkInTime).getTime()
      ) / 36e5,
  });

  const [listingCost, setListingCost] = useState([]);
  const [extraServices, setExtraServices] = useState([]);

  useEffect(() => {
    if (listing.listingCosts !== null)
      setListingCost(listing.listingCosts.map(mapListingCost));
    if (listing.listingServices !== null)
      setExtraServices(listing.listingServices.map(mapExtraService));
  }, []);

  const scheduleRent = (e) => {
    e.preventDefault();
    setFormData((prevState) => {
      prevState[e.currentTarget.name] = e.currentTarget.value;
      return { ...prevState };
    });
    setCartTotal((prevState) => {
      prevState.totalHours =
        Math.abs(
          new Date(formData.dateCheckedOut).getTime() -
            new Date(formData.dateCheckedIn).getTime()
        ) / 36e5;
      return { ...prevState };
    });
    setCartTotal((prevState) => {
      if (formData.listCostTypeId === 2) {
        prevState.totalListCost = formData.listCost * prevState.totalHours;
      }
      return { ...prevState };
    });
    setCartTotal((prevState) => {
      prevState.totalCost =
        prevState.totalListCost + prevState.totalExtraServiceCost;
      return { ...prevState };
    });
  };

  const isRateSelected = (e, list) => {
    if (e.target.checked) {
      setFormData((prevState) => {
        prevState.listCostTypeId = list.costTypeId;
        prevState.listCost = list.cost;
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        if (formData.listCostTypeId === 2) {
          prevState.totalListCost = list.cost * prevState.totalHours;
        } else {
          prevState.totalListCost = list.cost;
        }
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        prevState.totalCost =
          prevState.totalListCost + prevState.totalExtraServiceCost;
        return { ...prevState };
      });
    } else {
      setFormData((prevState) => {
        prevState.listCostTypeId = 0;
        prevState.listCost = 0;
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        prevState.totalListCost -= list.cost * prevState.totalHours;
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        prevState.totalCost =
          prevState.totalExtraServiceCost + prevState.totalListCost;
        return { ...prevState };
      });
    }
  };

  const mapListingCost = (list) => {
    return (
      <TableRow key={list.costTypeId}>
        <TableCell padding="checkbox">
          <Checkbox onChange={(e) => isRateSelected(e, list)} value={list} />
        </TableCell>
        <TableCell padding="checkbox">
          <span>{list.costType}</span>
        </TableCell>
        <TableCell padding="checkbox">
          <span>${list.cost}</span>
        </TableCell>
      </TableRow>
    );
  };

  const extraServiceSelected = (e, service) => {
    if (e.target.checked) {
      setFormData((prevState) => {
        prevState.additionalServices.push({
          entityTypeId: service.entityTypeId,
          cost: service.cost,
          costTypeId: service.costTypeId,
          costType: service.costType,
        });
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        if (service.costTypeId === 2) {
          prevState.totalExtraServiceCost +=
            service.cost * prevState.totalHours;
        } else {
          prevState.totalExtraServiceCost += service.cost;
        }
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        prevState.totalCost =
          prevState.totalListCost + prevState.totalExtraServiceCost;
        return { ...prevState };
      });
    } else {
      setFormData((prevState) => {
        prevState.additionalServices.splice(
          prevState.additionalServices.findIndex((additionalService) => {
            return additionalService.costTypeId === service.costTypeId;
          }),
          1
        );
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        if (service.costTypeId === 2) {
          prevState.totalExtraServiceCost -=
            service.cost * prevState.totalHours;
        } else {
          prevState.totalExtraServiceCost -= service.cost;
        }
        return { ...prevState };
      });
      setCartTotal((prevState) => {
        prevState.totalCost =
          prevState.totalExtraServiceCost + prevState.totalListCost;
        return { ...prevState };
      });
    }
  };

  const mapExtraService = (service) => {
    return (
      <TableRow key={service.costTypeId}>
        <TableCell padding="checkbox">
          <Checkbox
            onChange={(e) => extraServiceSelected(e, service)}
            name="additionalServices"
          />
        </TableCell>
        <TableCell padding="checkbox">
          <span>
            {service.costTypeId === 1 ? (
              <Fragment>
                <FontAwesomeIcon
                  icon={["fas", "users"]}
                  className="secondary-text font-size-lg mr-2"
                />
                <span>Staff</span>
              </Fragment>
            ) : (
              <Fragment>
                <FontAwesomeIcon
                  icon={["fas", "store"]}
                  className="secondary-text font-size-lg mr-2"
                />
                <span>Dinning Space</span>
              </Fragment>
            )}
          </span>
        </TableCell>
        <TableCell padding="checkbox">
          <span>{service.costType}</span>
        </TableCell>
        <TableCell padding="checkbox">
          <span>${service.cost}</span>
        </TableCell>
      </TableRow>
    );
  };

  const reserve = (e) => {
    e.preventDefault();
    let checkout = { type: "CHECKOUT", payload: { formData, listing } };
    _logger(checkout);
    history.push("/checkout", checkout);
  };

  const backToListings = (e) => {
    e.preventDefault();
    history.push("/listings");
  };

  return (
    <Fragment>
      <div className="bg-premium-white py-3">
        <Container className="py-3">
          <div className="card shadow-xxl mb-4">
            <div className="p-3 p-xl-5">
              <div className="d-flex flex-column align-items-center">
                <div className="pl-0 py-0 py-xl-2 text-center text-xl-left">
                  <form>
                    <div className="mb-4">
                      {listing.isActive ? (
                        <span className="badge badge-success badge-pill">
                          Available
                        </span>
                      ) : (
                        <span className="badge badge-warning badge-pill">
                          Fully Booked
                        </span>
                      )}
                      <Grid container>
                        <Grid container spacing={4}>
                          <Grid item>
                            <Box className="my-3">
                              <FontAwesomeIcon
                                icon={["far", "calendar"]}
                                className="text-success font-size-lg mr-2"
                              />
                              <strong className="text-success ">Start: </strong>
                              {format(
                                new Date(listing.checkInTime),
                                "EEE, MMM do hh:mma"
                              )}
                            </Box>
                            <div>
                              <TextField
                                size="small"
                                variant="outlined"
                                disabled={!listing.isActive}
                                type="datetime-local"
                                className="pb-3 "
                                onChange={scheduleRent}
                                name="dateCheckedIn"
                                value={formData.dateCheckedIn}
                              />
                            </div>
                          </Grid>
                          <Grid item>
                            <div className="my-3">
                              <FontAwesomeIcon
                                icon={["far", "calendar"]}
                                className="text-danger font-size-lg mr-2"
                              />
                              <strong className="text-danger">End: </strong>
                              {format(
                                new Date(listing.checkOutTime),
                                "EEE, MMM do hh:mma"
                              )}
                            </div>
                            <div>
                              <TextField
                                size="small"
                                variant="outlined"
                                disabled={!listing.isActive}
                                type="datetime-local"
                                className="pb-3"
                                onChange={scheduleRent}
                                name="dateCheckedOut"
                                value={formData.dateCheckedOut}
                              />
                            </div>
                          </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                          <Grid item>
                            {listing.listingServices !== null ? (
                              <Fragment>
                                <div className="my-3">
                                  <FontAwesomeIcon
                                    icon={["fas", "file-invoice-dollar"]}
                                    className="secondary-text font-size-lg mr-2"
                                  />
                                  <strong className="secondary-text">
                                    Rates:{" "}
                                  </strong>
                                </div>
                                <div>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell padding="checkbox">
                                          <TableSortLabel>
                                            <span>Rate</span>
                                          </TableSortLabel>
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                          <TableSortLabel>
                                            <span>Cost</span>
                                          </TableSortLabel>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>{listingCost}</TableBody>
                                  </Table>
                                </div>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <div className="pb-2"></div>
                              </Fragment>
                            )}
                          </Grid>

                          <Grid item>
                            {listing.listingServices !== null ? (
                              <Fragment>
                                <div className="my-3 mx-5 px-4">
                                  <FontAwesomeIcon
                                    icon={["fas", "plus"]}
                                    className="secondary-text font-size-lg mr-2"
                                  />
                                  <strong className="secondary-text">
                                    Additional Services Offered:{" "}
                                  </strong>
                                </div>
                                <div className="justify-content-right mx-5">
                                  <Table className="mx-3">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell
                                          padding="checkbox"
                                          className={classes.table}
                                        >
                                          <TableSortLabel>
                                            <span>Services</span>
                                          </TableSortLabel>
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                          <TableSortLabel>
                                            <span>Rate</span>
                                          </TableSortLabel>
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                          <TableSortLabel>
                                            <span>Cost</span>
                                          </TableSortLabel>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody className="mx-5">
                                      {extraServices}
                                    </TableBody>
                                  </Table>
                                </div>
                              </Fragment>
                            ) : (
                              <Fragment>
                                <div className="pb-2"></div>
                              </Fragment>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    <Button
                      type="submit"
                      size="large"
                      color="secondary"
                      variant="contained"
                      className="mr-4"
                      disabled={
                        !listing.isActive ||
                        formData.dateCheckedIn < listing.checkInTime ||
                        formData.dateCheckedIn > listing.checkOutTime ||
                        formData.dateCheckedIn >= formData.dateCheckedOut ||
                        formData.dateCheckedOut > listing.checkOutTime ||
                        formData.checkOutDate < listing.checkInTime ||
                        formData.dateCheckedOut <= formData.dateCheckedIn
                      }
                      onClick={reserve}
                    >
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon
                          icon={["fas", "shopping-cart"]}
                          className="text-white font-size-lg"
                        />
                      </span>
                      <span className="btn-wrapper--label">
                        {cartTotal.totalCost === 0
                          ? ""
                          : `$${cartTotal.totalCost}`}
                      </span>
                      <span className="btn-wrapper--label">Reserve Now</span>
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="default"
                      title="View documentation"
                      onClick={backToListings}
                    >
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={["fas", "arrow-left"]} />
                      </span>
                      <span className="btn-wrapper--label">
                        Back to listings
                      </span>
                    </Button>
                  </form>
                  <div className="mt-3">
                    <Button
                      color="primary"
                      size="small"
                      title="Licenses Details"
                    >
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={["far", "question-circle"]} />
                      </span>
                      <span className="btn-wrapper--label">
                        Licenses Details
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

ListingReservation.propTypes = listingPropTypes.ReservationPropTypes;

export default ListingReservation;
