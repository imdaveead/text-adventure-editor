/* eslint-disable */
/* cspell:disable */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Ripple from '@material-ui/core/ButtonBase/Ripple';
import withStyles from '@material-ui/core/styles/withStyles';

let hasPatched = false;
export function patch({ DURATION = 200, DELAY_RIPPLE = 50 } = {}) {
  if (hasPatched) throw new Error(
    'Do not call `material-ui-fast-ripple`\'s .patch() more than once. '
  );
  hasPatched = true;

  const styles = theme => ({
    root: {
      display: 'block',
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: 'inherit',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      zIndex: 0,
    },
    ripple: {
      width: 50,
      height: 50,
      left: 0,
      top: 0,
      opacity: 0,
      position: 'absolute',
    },
    rippleVisible: {
      opacity: 0.3,
      transform: 'scale(1)',
      animation: `mui-ripple-enter ${DURATION}ms ${theme.transitions.easing.easeInOut}`,
      animationName: '$mui-ripple-enter',
    },
    ripplePulsate: {
      animationDuration: `${theme.transitions.duration.shorter}ms`,
    },
    child: {
      opacity: 1,
      display: 'block',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
    childLeaving: {
      opacity: 0,
      animation: `mui-ripple-exit ${DURATION}ms ${theme.transitions.easing.easeInOut}`,
      animationName: '$mui-ripple-exit',
    },
    childPulsate: {
      position: 'absolute',
      left: 0,
      top: 0,
      animation: `mui-ripple-pulsate 2500ms ${theme.transitions.easing.easeInOut} 200ms infinite`,
      animationName: '$mui-ripple-pulsate',
    },
    '@keyframes mui-ripple-enter': {
      '0%': {
        transform: 'scale(0.2)',
        opacity: 0.1,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 0.3,
      },
    },
    '@keyframes mui-ripple-exit': {
      '0%': {
        opacity: 1,
      },
      '100%': {
        opacity: 0,
      },
    },
    '@keyframes mui-ripple-pulsate': {
      '0%': {
        transform: 'scale(1)',
      },
      '50%': {
        transform: 'scale(0.92)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  });

  class TouchRipple extends React.PureComponent {
    constructor() {
      super();
      this.state = {
        nextKey: 0,
        ripples: [],
      };
      this.pulsate = () => {
        this.start({}, { pulsate: true });
      };
      this.start = (event = {}, options = {}, cb) => {
        const {
          pulsate = false,
          center = this.props.center || options.pulsate,
          fakeElement = false, // For test purposes
        } = options;

        if (event.type === 'mousedown' && this.ignoringMouseDown) {
          this.ignoringMouseDown = false;
          return;
        }

        if (event.type === 'touchstart') {
          this.ignoringMouseDown = true;
        }

        const element = fakeElement ? null : ReactDOM.findDOMNode(this);
        const rect = element
          ? element.getBoundingClientRect()
          : {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
          };

        // Get the size of the ripple
        let rippleX;
        let rippleY;
        let rippleSize;

        if (
          center ||
          (event.clientX === 0 && event.clientY === 0) ||
          (!event.clientX && !event.touches)
        ) {
          rippleX = Math.round(rect.width / 2);
          rippleY = Math.round(rect.height / 2);
        } else {
          const clientX = event.clientX ? event.clientX : event.touches[0].clientX;
          const clientY = event.clientY ? event.clientY : event.touches[0].clientY;
          rippleX = Math.round(clientX - rect.left);
          rippleY = Math.round(clientY - rect.top);
        }

        if (center) {
          rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);

          // For some reason the animation is broken on Mobile Chrome if the size if even.
          if (rippleSize % 2 === 0) {
            rippleSize += 1;
          }
        } else {
          const sizeX =
            Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
          const sizeY =
            Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
          rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
        }

        // Touche devices
        if (event.touches) {
          // Prepare the ripple effect.
          this.startTimerCommit = () => {
            this.startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
          };
          // Delay the execution of the ripple effect.
          this.startTimer = setTimeout(() => {
            if (this.startTimerCommit) {
              this.startTimerCommit();
              this.startTimerCommit = null;
            }
          }, DELAY_RIPPLE); // We have to make a tradeoff with this value.
        } else {
          this.startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
        }
      };
      this.startCommit = params => {
        const { pulsate, rippleX, rippleY, rippleSize, cb } = params;

        this.setState(
          state => ({
            nextKey: state.nextKey + 1,
            ripples: [
              ...state.ripples,
              <Ripple
                key={state.nextKey}
                classes={this.props.classes}
                timeout={{
                  exit: DURATION,
                  enter: DURATION,
                }}
                pulsate={pulsate}
                rippleX={rippleX}
                rippleY={rippleY}
                rippleSize={rippleSize}
              />,
            ],
          }),
          cb,
        );
      };
      this.stop = (event, cb) => {
        clearTimeout(this.startTimer);
        const { ripples } = this.state;

        // The touch interaction occurs too quickly.
        // We still want to show ripple effect.
        if (event.type === 'touchend' && this.startTimerCommit) {
          event.persist();
          this.startTimerCommit();
          this.startTimerCommit = null;
          this.startTimer = setTimeout(() => {
            this.stop(event, cb);
          });
          return;
        }

        this.startTimerCommit = null;

        if (ripples && ripples.length) {
          this.setState(
            {
              ripples: ripples.slice(1),
            },
            cb,
          );
        }
      };
    }
    componentWillUnmount() {
      clearTimeout(this.startTimer);
    }
    render() {
      // eslint-disable-next-line no-unused-vars
      const { center, classes, className, ...other } = this.props;

      return (
        <TransitionGroup
          component='span'
          enter
          exit
          className={classnames(classes.root, className)}
          {...other}
        >
          {this.state.ripples}
        </TransitionGroup>
      );
    }
  }

  TouchRipple.propTypes = {
    center: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  TouchRipple.defaultProps = {
    center: false,
  };

  const TouchRippleModule = require('@material-ui/core/ButtonBase/TouchRipple');
  TouchRippleModule.default = withStyles(styles, { flip: false, name: 'MuiTouchRipple' })(TouchRipple);
}
