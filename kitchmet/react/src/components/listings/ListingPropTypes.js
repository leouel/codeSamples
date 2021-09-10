import PropTypes from "prop-types"

const ReservationPropTypes =  {
    details: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      shortDescription: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      checkInTime: PropTypes.string.isRequired,
      checkOutTime: PropTypes.string.isRequired,
      daysAvailable: PropTypes.number.isRequired,
      hasReservation: PropTypes.bool.isRequired,
      isActive: PropTypes.bool.isRequired,
      createdBy: PropTypes.number.isRequired,
      statusId: PropTypes.number.isRequired,
      rentalTypes: PropTypes.arrayOf(
        PropTypes.shape({ rentalType: PropTypes.string })
      ),
      listingServices: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          cost: PropTypes.number,
          costTypeId: PropTypes.number,
          costType: PropTypes.string,
        })
      ),
      listingCosts: PropTypes.arrayOf(
        PropTypes.shape({
          costTypeId: PropTypes.number,
          costType: PropTypes.string,
          cost: PropTypes.number,
        }).isRequired
      ),
      kitchen: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        shortDescription: PropTypes.string,
        description: PropTypes.string,
        kitchenType: PropTypes.string,
        managerAvatarUrl: PropTypes.string,
        imageUrl: PropTypes.string,
        hasBackgroundCheck: PropTypes.bool,
        isActive: PropTypes.bool,
        languagesSpoken: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        amenitiesTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        serviceTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        equpimentTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        applianceTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        refridgerationTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        cookwareTypes: PropTypes.arrayOf(
          PropTypes.shape({ name: PropTypes.string })
        ),
        location: PropTypes.shape({
          locationType: PropTypes.string,
          lineOne: PropTypes.string,
          lineTwo: PropTypes.string,
          city: PropTypes.string,
          zipCode: PropTypes.number,
          state: PropTypes.string,
          latitude: PropTypes.number,
          longitude: PropTypes.number,
        }),
        createdBy: PropTypes.shape({
          id: PropTypes.number,
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          email: PropTypes.string,
        }),
      }),
    }).isRequired,
  };

  export { ReservationPropTypes }