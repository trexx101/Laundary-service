import './home.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Row,
  Col,
  Alert,
  Container,
  Carousel,
  CarouselItem,
  CarouselCaption,
  CarouselIndicators,
  CarouselControl,
  Button,
} from 'reactstrap';

import { useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import warning = toast.warning;

const items = [
  {
    id: 1,
    altText: 'Slide 1',
    caption: 'Slide 1',
    src: 'https://picsum.photos/id/123/1200/400',
  },
  {
    id: 2,
    altText: 'Slide 2',
    caption: 'Slide 2',
    src: 'https://picsum.photos/id/456/1200/400',
  },
  {
    id: 3,
    altText: 'Slide 3',
    caption: 'Slide 3',
    src: 'https://picsum.photos/id/678/1200/400',
  },
];

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = newIndex => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map(item => {
    return (
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={item.id}
        s
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img src={item.src} alt={item.altText} />
        <CarouselCaption className="text-danger" captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <Container fluid={true}>
      <Row>
        <div>
          <style>
            {`.custom-tag {
              max-width: 100%;
              height: 500px;
              background: black;
            }`}
          </style>
          <Carousel next={next} previous={previous} activeIndex={activeIndex}>
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        </div>
      </Row>
      <Row>
        <div className="x-section-container">
          <div className="x-center-intro">
            <div className="x-emp-text for-xlarge">We collect, clean and deliver your laundry back to you</div>
            <figure className="x-center-intro-figure">
              <img
                src="https://uploads-ssl.webflow.com/61bd8d0f79a953e120face5e/632f225449442a914ca6eaf8_dq-bag.png"
                loading={'lazy'}
                className="x-center-intro-img-1"
                style={{
                  willChange: 'transform',
                  transform: `translate3d(85.797%, 0, 0) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                  transformStyle: 'preserve-3d',
                }}
              />
              <img
                src="https://uploads-ssl.webflow.com/61bd8d0f79a953e120face5e/632f225449442a914ca6eaf8_dq-bag.png"
                loading={'lazy'}
                className="x-center-intro-img-2"
                style={{
                  willChange: 'transform',
                  transform: `translate3d(42.8985%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                  transformStyle: 'preserve-3d',
                }}
              />
              <div className="x-wash-machine for-intro">
                <div className="x-wm-panel"></div>
                <div className="x-wm-tumbler">
                  <div className="x-wm-tumbler-container">
                    <div
                      className="x-wm-bubble-1"
                      style={{
                        transform: `translate3d(0%, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    ></div>
                    <div
                      className="x-wm-bubble-2"
                      style={{
                        transform: `translate3d(0%, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    ></div>
                    <div
                      className="x-wm-bubble-3"
                      style={{
                        transform: `translate3d(0%, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    ></div>
                    <img
                      src="https://uploads-ssl.webflow.com/61bd8d0f79a953e120face5e/62ef44a8d64065d335baee79_tumble-turn.svg"
                      className="x-wm-content"
                      style={{
                        transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(271.235deg) skew(0deg, 0deg)`,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform',
                      }}
                    />
                    <img
                      src="https://uploads-ssl.webflow.com/61bd8d0f79a953e120face5e/62ef44a81cef284d11249129_tumble-blade.svg"
                      className="x-wm-blade"
                      style={{
                        transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(359.831deg) skew(0deg, 0deg)`,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform',
                      }}
                    />
                  </div>
                </div>
              </div>
              <img
                src="https://uploads-ssl.webflow.com/61bd8d0f79a953e120face5e/632f28cb829453580df26763_dq-van.svg"
                loading={'lazy'}
                className="x-center-intro-img-3"
                style={{
                  willChange: 'transform',
                  transform: `translate3d(-36.9065%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`,
                  transformStyle: 'preserve-3d',
                }}
              />
            </figure>
            <div>
              <div className="x-lead-text">
                No more waiting!
                <br />
                Get your laundry back fast with perfume smelling scent which lasts up to 6 months!
              </div>
            </div>
          </div>
        </div>
      </Row>

      <h2 className="x-h2">How to place order</h2>
      <Row md="3" sm="2" xs="1">
        <Col>
          <div className="x-preview-col">
            <div className="x-icon for-guide"></div>
            <h3 className="x-h4">Book online</h3>
            <p>
              Choose the bag sizes you wish to wash. Price by bags, not weight.
              <br />
            </p>
          </div>
        </Col>
        <Col>
          <div className="x-preview-col">
            <div className="x-icon for-guide"></div>
            <h3 className="x-h4">Choose time slot</h3>
            <p>
              Pick the day and time for pick up, we'll handle the rest.
              <br />
            </p>
          </div>
        </Col>
        <Col>
          <div className="x-preview-col">
            <div className="x-icon for-guide"></div>
            <h3 className="x-h4">Meet your driver</h3>
            <p>
              Our delivery partner will meet you to collect your laundry.
              <br />
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <div className="x-section-footer">
          <div>[1] Only for Express Same Day Delivery orders picked up before 1pm. Return time is subjected to traffic conditions.</div>
        </div>
        <br />
        <Button className="align-self-center" size="lg">
          Book a Pickup Now
        </Button>
      </Row>

      <Row>
        <h2>About Us</h2>
        <Col md="4" className="pad">
          <span className="x-section-thumb rounded" />
        </Col>
        <Col md="8">
          <p className="lead">
            dobiQueen self service and laundry pickup Malaysia is an easy and convenient way to have your weekly laundry cleaned and dried
            using heavy duty industrial laundry machines at affordable prices. With dobiQueen’s 24 hours laundry service near you, be rest
            assured that your weekly laundry is already covered. With ELECTROLUX Professional washers and laundry dryers, dobiQueen coin
            operated laundry service Malaysia are at your service to bring a faster, cleaner and a laundry service alternative near you.
            Unlike usual laundry delivery services, we have the infrastructure and resources to provide same day doorstep pickup and
            delivery laundry services without hidden costs.
          </p>
          <Alert color="success">Same day delivery</Alert>
          <Alert color="success">Both self service + Pickup & delivery</Alert>
          <Alert color="success">Wide variety of laundry types</Alert>
        </Col>
      </Row>
      <Row>
        <div className="x-upsell-bar">
          <div className="x-limit">
            <div className="x-upsell-wrapper">
              <FontAwesomeIcon icon="hand-heart" />
              <div className="lead">
                Got dirty laundry?
                <br />
                Book a pickup now.
              </div>
              <Button size="lg" color="warning" tag={Link} to={`/booking/new`}>
                Book now
              </Button>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
};
export default Home;
