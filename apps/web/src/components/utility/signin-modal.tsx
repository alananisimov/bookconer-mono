import { signIn } from "next-auth/react";
import { useState, useCallback, useMemo } from "react";
import { LoadingDots, Google } from "~/components/shared/icons";

import { Button } from "~/components/shared/ui/shadcn/button";
import Modal from "../shared/widgets/modal";
import { useSignInModalStore } from "../../store";
import MyImage from "../shared/widgets/image";

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}) => {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b  px-4 py-6 pt-8 text-center md:px-16">
        <a href="https://bookconer.site">
          <MyImage
            src="/book.webp"
            alt="Logo"
            className="h-14 w-14 rounded-full border  p-2"
            width={20}
            height={20}
          />
        </a>
        <h3 className="font-display text-2xl font-bold">Войти</h3>
        <p className="text-sm text-gray-500">
          Войдите в аккаунт для дальнейших покупок
        </p>
      </div>

      <div className="flex flex-col space-y-4 px-4 py-8 md:px-16">
        <Button
          disabled={signInClicked}
          className={`${
            signInClicked && "cursor-not-allowed"
          } flex h-10 w-full items-center justify-center space-x-3  text-sm  transition-all duration-75`}
          variant={"outline"}
          onClick={async () => {
            setSignInClicked(true);
            await signIn("google");
          }}
        >
          {signInClicked ? (
            <LoadingDots color="#808080" />
          ) : (
            <>
              <Google className="h-5 w-5" />
              <p>Войти через Google</p>
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export function useSignInModal() {
  const { showSignInModal, setShowSignInModal } = useSignInModalStore();

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  );
}
