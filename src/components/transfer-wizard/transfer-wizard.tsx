import React from "react";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { TransferForm } from "./transfer-form";
import { TransferConfirm } from "./transfer-confirm";
import { TransferSuccess } from "./transfer-success";
import { Card } from "../ui/card";

export enum TransferWizardSteps {
  FORM = "FORM",
  CONFIRM = "CONFIRM",
  SUCCESS = "SUCCESS",
}

type FormState = {
  kind: TransferWizardSteps.FORM;
  data: {
    amount?: string;
    recipient?: string;
  };
};

type ConfirmState = {
  kind: TransferWizardSteps.CONFIRM;
  data: {
    amount: string;
    recipient: string;
  };
};

type SuccessState = {
  kind: TransferWizardSteps.SUCCESS;
};

type TransferWizardState = FormState | ConfirmState | SuccessState;

export function TransferWizard({ onClose }: { onClose: () => void }) {
  const [direction, setDirection] = React.useState<number>();
  const [ref, bounds] = useMeasure();
  const [wizardState, setWizardState] = React.useState<TransferWizardState>({
    kind: TransferWizardSteps.FORM,
    data: {},
  });

  const handleFormData = (data: ConfirmState["data"]) => {
    setDirection(1);
    setWizardState({
      ...wizardState,
      kind: TransferWizardSteps.CONFIRM,
      data,
    });
  };

  const handleConfirmationData = () => {
    setDirection(1);
    setWizardState({
      ...wizardState,
      kind: TransferWizardSteps.SUCCESS,
    });
  };

  const handleConfirmBack = () => {
    setDirection(-1);
    if (wizardState.kind === TransferWizardSteps.CONFIRM) {
      setWizardState({
        ...wizardState,
        kind: TransferWizardSteps.FORM,
      });
    }
  };

  const content = React.useMemo(() => {
    switch (wizardState.kind) {
      case TransferWizardSteps.FORM:
        return (
          <TransferForm
            data={wizardState.data}
            onClose={onClose}
            onNext={handleFormData}
          />
        );
      case TransferWizardSteps.CONFIRM:
        return (
          <TransferConfirm
            data={wizardState.data}
            onBack={handleConfirmBack}
            onNext={handleConfirmationData}
          />
        );
      case TransferWizardSteps.SUCCESS:
        return <TransferSuccess onClose={onClose} />;
    }
  }, [wizardState.kind]);

  return (
    <Card>
      <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
        <motion.div
          animate={{ height: bounds.height }}
          className="relative overflow-hidden"
        >
          <div ref={ref}>
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                key={wizardState.kind}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </Card>
  );
}

const variants = {
  initial: (direction: number) => {
    return { x: `${110 * direction}%`, opacity: 0 };
  },
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => {
    return { x: `${-110 * direction}%`, opacity: 0 };
  },
};
