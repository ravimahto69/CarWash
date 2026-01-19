# India-Specific Updates (Vehicles & Wash Packages)

## What changed
- Booking form now supports multi-vehicle types: Bike/Scooter, Hatchback, Sedan, SUV, Luxury, Pickup/Van, Truck, Electric (EV).
- Added India-focused wash packages with prices and better, dynamic selection based on vehicle type.
- Service dropdown now shows price and target vehicle; booking amount uses the selected package price.
- Services are now DB-driven capable via new fields in the Service model: vehicleTags and prices per vehicle type.

## Files updated
- src/app/models/Service.js (per-vehicle pricing + tags)
- src/app/api/services/route.js (accepts prices + vehicleTags)
- src/app/component/Admin.jsx (create services with multi-vehicle prices)
- src/app/component/Book.jsx (fetch services, dynamic options)

## How to use
1) Go to Book a Service.
2) Pick the correct Vehicle Type from the new list.
3) Choose a Wash Package; price auto-applies to the booking/payment flow.

### Admin: add a new package
1) Open Admin → Services → Add Service.
2) Fill Service Name, optional Description, Duration (min).
3) Select Applicable Vehicles and fill the Per-vehicle prices (₹) you want.
4) Mark Active and save.

## Next suggestions (optional)
- Add edit/delete to Admin services list.
- Add images/icons per service for richer Home and Services pages.
- Validate numeric inputs and highlight missing per-vehicle prices.
