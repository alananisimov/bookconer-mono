"use client";
import MyImage from "~/components/shared/widgets/image";
import mobilebanner from "~/assets/sample_banner.webp";
import desktopbanner from "~/assets/sample_banner2.webp";
export default function Banner() {
  return (
    <>
      <div className=" hidden gap-4 md:flex md:flex-row" id="banner">
        <div className="h-full">
          <MyImage
            src={mobilebanner}
            alt=""
            loading="eager"
            placeholder="blur"
            priority
            className="h-full w-screen rounded-lg object-contain "
          />
        </div>
      </div>
      <MyImage
        src={desktopbanner}
        alt=""
        placeholder="blur"
        priority
        className="h-auto w-screen rounded-lg object-contain md:hidden"
      />
    </>
  );
}
