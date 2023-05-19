import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const fontFamily = {
    kr: "Roboto",
    en: "Roboto",
};

export const GlobalStyle = {
    fontFamily,
};

const GlobalStyleElement = createGlobalStyle`
  ${reset}
  html,body {
    width: 100%;
    height: 100%;
    font-family: "Pretendard","Montserrat","Hahmlet",sans-serif!important;
    color:#2C2C2C;
    overscroll-behavior: none;
    image-rendering: -moz-crisp-edges;         /* Firefox */
    image-rendering:   -o-crisp-edges;         /* Opera */
    image-rendering: -webkit-optimize-contrast;/* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;  /* IE (non-standard property) */
    background-color:#FFFFFF
  }

  body {
    line-height: unset;
  }
  img{
    -webkit-user-drag: none;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent; 
  }

  *:focus {
    outline: none;
}

  ol, ul, li {
	list-style: none;
}
.swiper-pagination-bullet.swiper-pagination-bullet-active{
    color: #7144FF;
    background-color: #7144FF;
}
img {  
   user-drag: none;  
   user-select: none;
   -moz-user-select: none;
   -webkit-user-drag: none;
   -webkit-user-select: none;
   -ms-user-select: none;
}
a {
  text-decoration: none;
  color: black;
}

  svg {
    cursor:pointer;
  }

  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-repeat:no-repeat;
    background-position:center;
}

button {
   border:none;
   background-color:transparent;
   outline:none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

input {    
     -webkit-appearance: none;
     --moz-appearance:none;
     appearance: none;
}

.fade-in-down {
    -webkit-animation: fadeInDown 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeInDown 500ms ease-in-out;
}

/* Standard syntax */
@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}
/* Chrome, Safari, Opera */
@-webkit-keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}




/* Chrome, Safari, Opera */
@-webkit-keyframes fadeInDown {
    0% {
        opacity: 0;
        -webkit-transform: translateY(-40px);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    -webkit-animation: fadeInUp 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeInUp 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeInUp {
    0% {
        opacity: 0;
        -webkit-transform: translateY(40px);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-left {
    -webkit-animation: fadeInLeft 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeInLeft 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeInLeft {
    0% {
        opacity: 0;
        -webkit-transform: translateX(80px);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeInLeft {
    0% {
        opacity: 0;
        transform: translateX(80px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-right {
    -webkit-animation: fadeInRight 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeInRight 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeInRight {
    0% {
        opacity: 0;
        -webkit-transform: translateX(-80px);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeInRight {
    0% {
        opacity: 0;
        transform: translateX(-80px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}



.fade-out-down {
    -webkit-animation: fadeOutDown 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeOutDown 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeOutDown {
    100% {
        opacity: 0;
        -webkit-transform: translateY(-40px);
    }
    0% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeOutDown {
    100% {
        opacity: 0;
        transform: translateY(-40px);
    }
    0% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-out-up {
    -webkit-animation: fadeOutUp 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeOutUp 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeOutUp {
    100% {
        opacity: 0;
        -webkit-transform: translateY(40px);
    }
    0% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeOutUp {
    100% {
        opacity: 0;
        transform: translateY(40px);
    }
    0% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-out-left {
    -webkit-animation: fadeOutLeft 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeOutLeft 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeOutLeft {
    100% {
        opacity: 0;
        -webkit-transform: translateX(80px);
    }
    0% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeOutLeft {
    100% {
        opacity: 0;
        transform: translateX(80px);
    }
    0% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-out-right {
    -webkit-animation: fadeOutRight 500ms ease-in-out; /* Chrome, Safari, Opera */
    animation: fadeOutRight 500ms ease-in-out;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes fadeOutRight {
    100% {
        opacity: 0;
        -webkit-transform: translateX(-80px);
    }
    0% {
        opacity: 1;
        -webkit-transform: translateY(0);
    }
}

/* Standard syntax */
@keyframes fadeOutRight {
    100% {
        opacity: 0;
        transform: translateX(-80px);
    }
    0% {
        opacity: 1;
        transform: translateY(0);
    }
}

.filter-blur{
  backdrop-filter: blur(40px);
}

.custom-dialog {
    max-width: 640px !important;
}
.MuiTooltip-tooltip{
    background-color: #374553!important;
    color: #FFFFFF!important;
    font-size: 13px!important;
    padding: 16px 16px!important;
    line-height: 16px!important;
    border-radius: 12px!important;
    font-weight: 400!important;
    max-width: 336px!important;
    .MuiTooltip-arrow:before{
        background-color: #374553!important;
    }
}
.modal .modal-content{
        border-radius: 24px!important;
    }
@media screen and (max-width: 767px) {
    .custom-dialog {
        max-width: 767px !important;
        margin:0px;
    }
    .modal{
        padding: 0px!important;
        max-width: 767px !important;
        .modal-content{
            border: 0px!important;
            border-radius: 0px!important;
        }
    }
    .modal-fullscreen {
        height: auto;
    }
    .navbar-custom{
        border: 0px;
        padding: 0px;
    }
}
.MuiMobileStepper-dots{
 gap: 8px
}
`;

export default GlobalStyleElement;
