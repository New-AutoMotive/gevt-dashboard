# Global EV Tracker Dashboard

An interactive dashboard for exploring electric vehicle registration trends across countries worldwide. Built by [New AutoMotive](https://newautomotive.org/).

## Visualisations

The dashboard offers four main views, each designed to highlight a different aspect of the EV transition:

- **Monthly New Registrations** — Stacked area chart showing the volume of new vehicle registrations over time, broken down by fuel type (BEV, PHEV, HEV, ICE, Diesel, Petrol, etc.). Supports an optional market-share mode that displays each fuel type as a percentage of total registrations.

- **Manufacturers Comparison** — Compare the market share of a selected manufacturer across multiple countries over time. Filter by fuel type and manufacturer to explore competitive dynamics in the EV market.

- **S-Curve Adoption** — Plots the classic S-curve of technology adoption for battery electric vehicles, showing BEV share against cumulative penetration. Includes a backtesting feature to evaluate how well the logistic curve fit historical data.

- **Top BEV Manufacturers** — Rankings of the leading battery electric vehicle manufacturers by registration volume, shown both as all-time cumulative totals and as a monthly rolling view.

All views include configurable rolling-window smoothing and CSV data export.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Apache ECharts
- **Database**: Cloud SQL (MySQL)
- **Deployment**: Google Cloud Run via GitHub Actions (Workload Identity Federation)

## Data

Data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See the [Methodology](public/GEVT_methodology.pdf) document for details on data sources and processing.
