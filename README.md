# Route Planner Web Application

A web-based application for planning routes using open-source maps, where users can customize the route design and download the route in KML and GPX formats.

## Features

- Plot and customize routes on an open-source map.
- Download routes in KML and GPX formats for use in other applications.
- User-friendly interface for easy route creation.
- Save and load routes.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (for interactive map rendering).
- **Backend**: Django (for managing data and serving API endpoints).
- **Map API**: (OpenStreetMap)
- **File Format Conversion**: (simplekml, gpxpy)

## Setup Instructions

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Mehtab-Sidhu/route_planner.git
    cd route_planner
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # For Windows use: venv\Scripts\activate
    ```

3. Apply database migrations (if necessary):
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Run the development server:
    ```bash
    python manage.py runserver
    ```

    The server should now be running at `http://127.0.0.1:8000`.

## Usage

- Navigate to the web application in your browser.
- Use the map interface to plot your route.
- Customize the route as needed.
- Save route and load saved routes.
- Download the route in KML or GPX format for further use.

## Contributing

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes and push to your branch.
4. Create a pull request.

---

Happy Coding!📌
