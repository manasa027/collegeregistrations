import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-height-[80vh] mt-12">
    <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
    <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="text-blue-600">
      Go to Home
    </Link>
  </div>
);

export default NotFound;

