import { useEffect, useState } from "react";
import {
  GitBranch,
  Check,
  AlertTriangle,
  X,
  Clock3,
} from "lucide-react";

import SectionCard from "../common/SectionCard";

/* ============================================================
   FLOW STEPS
============================================================ */

const FLOW_STEPS = [
  {
    id: 1,
    name: "Seeburger (SB)",
  },
  {
    id: 2,
    name: "SB Msg Tracker",
  },
  {
    id: 4,
    name: "C:E / MQ",
  },
  {
    id: 5,
    name: "Not Processed at EDI",
  },
  {
    id: 6,
    name: "Processed at EDI",
  },
];

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS = {
  success: {
    bg: "bg-green-500",
    icon: Check,
  },

  warning: {
    bg: "bg-amber-400",
    icon: AlertTriangle,
  },

  failed: {
    bg: "bg-red-500",
    icon: X,
  },

  pending: {
    bg: "bg-white border-2 border-gray-300",
    icon: Clock3,
  },
};

/* ============================================================
   EDI STATES
============================================================ */

const EDI_SUCCESS_STATES = new Set([
  "75EDP799",
]);

const EDI_WARNING_STATES = new Set([
  "05EDP555",
  "05EDP556",
  "05EDP700",
  "05EDP704",
  "05EDP720",
  "05EDP730",
  "05EDP731",
  "10EDP740",
  "9999OMIT",
]);

/* ============================================================
   CHECK ODS DATA
============================================================ */

function hasOdsData(eoStateCd) {
  return (
    eoStateCd !== null &&
    eoStateCd !== undefined &&
    String(eoStateCd).trim() !== ""
  );
}

/* ============================================================
   GET EDI STATUS
============================================================ */

function getEdiStatus(eoStateCd) {
  if (!hasOdsData(eoStateCd)) {
    return "no-data";
  }

  const normalizedState = String(eoStateCd)
    .trim()
    .toUpperCase();

  if (EDI_SUCCESS_STATES.has(normalizedState)) {
    return "success";
  }

  if (EDI_WARNING_STATES.has(normalizedState)) {
    return "warning";
  }

  return "pending";
}

/* ============================================================
   LEGEND
============================================================ */

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2.5 h-2.5 rounded-full ${color}`}
      />

      <span className="text-[11px] text-[#6B7280]">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ProcessFlowSection({
  eoStateCd,
}) {
  const ediStatus = getEdiStatus(eoStateCd);

  /*
   currentStep:

   -1 = animation has not started
    0 = Seeburger reached
    1 = SB Msg Tracker reached
    2 = C:E / MQ reached
    3 = Not Processed at EDI reached
    4 = Processed at EDI reached
  */

  const [currentStep, setCurrentStep] = useState(-1);

  /* ==========================================================
     RESET ANIMATION WHEN STATE CHANGES
  ========================================================== */

  useEffect(() => {
    if (ediStatus === "no-data") {
      setCurrentStep(-1);
      return;
    }

    /*
      Start from -1 every time a new state comes in.
    */
    setCurrentStep(-1);

    /*
      Small delay before starting.
    */
    const startTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 400);

    return () => {
      clearTimeout(startTimer);
    };
  }, [eoStateCd]);

  /* ==========================================================
     PROGRESS TO NEXT STEP
  ========================================================== */

  useEffect(() => {
    /*
      Animation hasn't started yet.
    */
    if (currentStep < 0) {
      return;
    }

    /*
      SUCCESS
      Stop once Processed at EDI is reached.
    */
    if (
      ediStatus === "success" &&
      currentStep >= FLOW_STEPS.length - 1
    ) {
      return;
    }

    /*
      WARNING
      Stop once Not Processed at EDI is reached.
    */
    if (
      ediStatus === "warning" &&
      currentStep >= 3
    ) {
      return;
    }

    /*
      Unknown state.
      Don't continue automatically.
    */
    if (ediStatus === "pending") {
      return;
    }

    /*
      Move to next step.

      Increase this value if you want
      the animation to be slower.
    */
    const timer = setTimeout(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;

        /*
          Safety protection.
          Never go beyond the final step.
        */
        if (nextStep >= FLOW_STEPS.length) {
          return FLOW_STEPS.length - 1;
        }

        return nextStep;
      });
    }, 900);

    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, ediStatus]);

  /* ============================================================
     NO ODS DATA
  ============================================================ */

  if (ediStatus === "no-data") {
    return (
      <SectionCard
        icon={GitBranch}
        title="Processing Flow Status"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-gray-100
              flex
              items-center
              justify-center
              mb-3
            "
          >
            <GitBranch
              size={22}
              className="text-gray-400"
            />
          </div>

          <div
            className="
              text-sm
              font-semibold
              text-[#374151]
            "
          >
            No data Available
          </div>

          <div
            className="
              text-xs
              text-[#9CA3AF]
              mt-1
            "
          >
            Processing flow information is not available.
          </div>
        </div>
      </SectionCard>
    );
  }

  /* ============================================================
     GET STEP STATUS
  ============================================================ */

  function getStepStatus(index) {
    /*
      Before animation starts.
    */
    if (currentStep < 0) {
      return "pending";
    }

    /* ----------------------------------------------------------
       SUCCESS
    ---------------------------------------------------------- */

    if (ediStatus === "success") {
      if (index <= currentStep) {
        return "success";
      }

      return "pending";
    }

    /* ----------------------------------------------------------
       WARNING
    ---------------------------------------------------------- */

    if (ediStatus === "warning") {
      /*
        Everything before Not Processed at EDI
        becomes green.
      */
      if (index < 3 && index <= currentStep) {
        return "success";
      }

      /*
        Not Processed at EDI becomes amber.
      */
      if (index === 3 && currentStep >= 3) {
        return "warning";
      }

      /*
        Processed at EDI must remain pending.
      */
      return "pending";
    }

    return "pending";
  }

  /* ============================================================
     GET CONNECTOR STATUS
  ============================================================ */

  function getConnectorStatus(index) {
    /*
      Connector index 0:
      Seeburger -> SB Msg Tracker

      Connector index 1:
      SB Msg Tracker -> C:E / MQ

      Connector index 2:
      C:E / MQ -> Not Processed at EDI

      Connector index 3:
      Not Processed at EDI -> Processed at EDI
    */

    if (ediStatus === "success") {
      /*
        Connector becomes permanently green
        after the destination node is reached.
      */
      if (index < currentStep) {
        return "success";
      }

      return "pending";
    }

    if (ediStatus === "warning") {
      /*
        Green only until C:E / MQ -> Not Processed.
      */

      if (index < 3 && index < currentStep) {
        return "success";
      }

      return "pending";
    }

    return "pending";
  }

  /* ============================================================
     CURRENT CONNECTOR IS ANIMATING
  ============================================================ */

  function isAnimatingConnector(index) {
    /*
      Connector should animate only when:
      current step is the source node.

      Example:

      currentStep = 0

      Seeburger
         |
         | ANIMATING
         ↓
      SB Msg Tracker
    */

    if (index !== currentStep) {
      return false;
    }

    /*
      There is no connector after final step.
    */
    if (currentStep >= FLOW_STEPS.length - 1) {
      return false;
    }

    /*
      Warning must stop at Not Processed at EDI.
    */
    if (
      ediStatus === "warning" &&
      currentStep >= 3
    ) {
      return false;
    }

    /*
      Unknown state doesn't animate.
    */
    if (ediStatus === "pending") {
      return false;
    }

    return true;
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <SectionCard
      icon={GitBranch}
      title="Processing Flow Status"
      actions={
        <div className="flex items-center gap-5">
          <LegendItem
            color="bg-green-500"
            label="Success"
          />

          <LegendItem
            color="bg-amber-400"
            label="Warning"
          />

          <LegendItem
            color="bg-red-500"
            label="Failed"
          />

          <LegendItem
            color="bg-gray-400"
            label="Pending"
          />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <div
          className="
            flex
            justify-between
            items-start
            min-w-[900px]
            px-4
            py-5
          "
        >
          {FLOW_STEPS.map((step, index) => {
            const stepStatus = getStepStatus(index);

            const cfg = STATUS[stepStatus];

            const Icon = cfg.icon;

            const connectorStatus =
              getConnectorStatus(index);

            const connectorAnimating =
              isAnimatingConnector(index);

            return (
              <div
                key={step.id}
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  flex-1
                "
              >
                {/* =================================================
                    CONNECTOR
                ================================================= */}

                {index !== FLOW_STEPS.length - 1 && (
                  <div
                    className="
                      absolute
                      top-4
                      left-1/2
                      w-full
                      h-[4px]
                      rounded-full
                      overflow-hidden
                      bg-gray-300
                    "
                    style={{
                      zIndex: 0,
                    }}
                  >
                    {/* ---------------------------------------------
                        PERMANENT GREEN CONNECTOR
                    --------------------------------------------- */}

                    {connectorStatus === "success" && (
                      <div
                        className="
                          absolute
                          inset-0
                          bg-green-500
                          rounded-full
                        "
                      />
                    )}

                    {/* ---------------------------------------------
                        ANIMATED GREEN CONNECTOR
                    --------------------------------------------- */}

                    {connectorAnimating && (
                      <div
                        key={`${ediStatus}-${eoStateCd}-${index}-${currentStep}`}
                        className="flow-progress"
                      />
                    )}
                  </div>
                )}

                {/* =================================================
                    CIRCLE
                ================================================= */}

                <div
                  className={`
                    relative
                    z-10
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-sm
                    transition-all
                    duration-300
                    ${cfg.bg}

                    ${
                      stepStatus === "success"
                        ? "flow-success-pop"
                        : ""
                    }

                    ${
                      stepStatus === "warning"
                        ? "flow-warning-pop"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={2.5}
                    className={
                      stepStatus === "pending"
                        ? "text-gray-500"
                        : "text-white"
                    }
                  />
                </div>

                {/* =================================================
                    LABEL
                ================================================= */}

                <div className="mt-4 text-center">
                  <div
                    className="
                      text-[11px]
                      font-semibold
                      text-[#374151]
                      whitespace-nowrap
                    "
                  >
                    {step.name}
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-[#6B7280]
                      mt-1
                    "
                  >
                    {stepStatus === "success" &&
                      "Completed"}

                    {stepStatus === "warning" &&
                      "Not Processed"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================================
          ANIMATION CSS
      ========================================================== */}

      <style>
        {`
          /* ========================================================
             GREEN CONNECTOR TRAVEL
          ======================================================== */

          @keyframes flowProgress {
            0% {
              width: 0%;
              opacity: 1;
            }

            100% {
              width: 100%;
              opacity: 1;
            }
          }

          .flow-progress {
            position: absolute;
            top: 0;
            left: 0;

            width: 0%;
            height: 100%;

            border-radius: 999px;

            background: #22c55e;

            box-shadow:
              0 0 5px rgba(34, 197, 94, 0.9),
              0 0 10px rgba(34, 197, 94, 0.65),
              0 0 16px rgba(34, 197, 94, 0.35);

            animation:
              flowProgress
              0.9s
              cubic-bezier(0.4, 0, 0.2, 1)
              forwards;
          }


          /* ========================================================
             SUCCESS NODE
          ======================================================== */

          @keyframes successPop {
            0% {
              transform: scale(0.75);
              opacity: 0.4;
            }

            60% {
              transform: scale(1.15);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .flow-success-pop {
            animation:
              successPop
              0.3s
              ease-out;
          }


          /* ========================================================
             WARNING NODE
          ======================================================== */

          @keyframes warningPop {
            0% {
              transform: scale(0.75);
              opacity: 0.4;
            }

            60% {
              transform: scale(1.15);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .flow-warning-pop {
            animation:
              warningPop
              0.3s
              ease-out;
          }
        `}
      </style>
    </SectionCard>
  );
}