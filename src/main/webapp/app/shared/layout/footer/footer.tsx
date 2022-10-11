import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p className="lead">© 2022 WASHMAN</p>
        <p> 8am – 5pm (Mondays – Fridays)
          8am – 12pm (Saturdays)
          Closed on Sundays and PHs</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
