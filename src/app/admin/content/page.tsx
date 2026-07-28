import { Button, Card, Field } from "@/components/panel/Ui"
import { brandLogos } from "@/lib/brands"
import { products, siteContent } from "@/lib/data"
import BrandIcon from "@/components/site/BrandIcon"

export default function AdminContentPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#cfe6f7] bg-[#f2f9fe] p-5">
        <p className="text-[12px] font-bold text-[#1c5f9e]">مدیریت محتوای سایت</p>
        <p className="mt-1.5 text-[11.5px] leading-6 text-slate-600">
          همهٔ متن‌های سایت — از تیتر هیرو تا متن فوتر، تصاویر محصولات و لوگوی برندها — از همین بخش قابل تغییر است.
        </p>
      </div>

      <Card title="هویت فروشگاه">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="نام فارسی" defaultValue={siteContent.brand.nameFa} />
          <Field label="نام لاتین" defaultValue={siteContent.brand.nameEn} latin />
          <Field label="شعار فروشگاه" defaultValue={siteContent.brand.tagline} />
          <Field label="نشانهٔ لوگو" defaultValue={siteContent.brand.logoMark} />
        </div>
        <div className="mt-4">
          <Button>ذخیره</Button>
        </div>
      </Card>

      <Card title="بخش هیرو صفحهٔ اصلی">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="تیتر اصلی — خط اول" defaultValue={siteContent.hero.headlineTop} />
          <Field label="تیتر اصلی — خط دوم" defaultValue={siteContent.hero.headlineBottom} />
          <div className="lg:col-span-2">
            <Field label="زیرتیتر" textarea rows={3} defaultValue={siteContent.hero.subheadline} />
          </div>
          <Field label="متن دکمهٔ اصلی" defaultValue={siteContent.hero.ctaLabel} />
          <Field label="متن دکمهٔ نوار شناور" defaultValue={siteContent.hero.navCta.label} />
          <div className="lg:col-span-2">
            <Field
              label="نشانی ویدیوی هیرو"
              defaultValue={siteContent.hero.videoSrc}
              latin
              hint="قالب mp4 با پخش خودکار و بی‌صدا. در چیدمان راست‌چین، ویدیو سمت چپ و متن سمت راست قرار می‌گیرد."
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button>ذخیرهٔ تغییرات هیرو</Button>
          <Button variant="ghost">پیش‌نمایش</Button>
        </div>
      </Card>

      <Card title="لوگوی برندهای نوار متحرک" action={<Button variant="ghost">افزودن برند</Button>}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {brandLogos.map((brand) => (
            <div key={brand.name} className="rounded-2xl border border-slate-200/70 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50">
                  <BrandIcon slug={brand.slug} size={22} color={`#${brand.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-latin text-[12px] font-bold text-[#0a1b33]">{brand.name}</p>
                  <p className="font-latin mt-0.5 text-[10.5px] text-slate-400">{brand.gradient.from}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button variant="ghost">ویرایش</Button>
                <Button variant="danger">حذف</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="تصاویر و لوگوی محصولات">
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/70 p-4"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50">
                <BrandIcon slug={product.logo} size={26} color="#0a1b33" />
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="text-[12px] font-bold text-[#0a1b33]">{product.title}</p>
                <p className="font-latin mt-1 text-[10.5px] text-slate-400">{product.slug}</p>
              </div>
              <input
                dir="ltr"
                defaultValue={product.logo}
                className="font-latin min-w-[220px] flex-[2] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-[11.5px] outline-none focus:border-[#2783de]"
              />
              <Button variant="ghost">بارگذاری تصویر</Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="متن معرفی و فوتر">
          <div className="space-y-4">
            <Field label="متن دربارهٔ ما در فوتر" textarea rows={6} defaultValue={siteContent.footer.about} />
            <Button>ذخیره</Button>
          </div>
        </Card>

        <Card title="اطلاعات تماس">
          <div className="space-y-4">
            <Field label="تلفن" defaultValue={siteContent.contact.phone} />
            <Field label="ایمیل پشتیبانی" defaultValue={siteContent.contact.email} latin />
            <Field label="تلگرام پشتیبانی" defaultValue={siteContent.contact.telegram} latin />
            <Field label="نشانی" defaultValue={siteContent.contact.address} />
            <Field label="ساعات پاسخ‌گویی" defaultValue={siteContent.contact.hours} />
            <Button>ذخیره</Button>
          </div>
        </Card>
      </div>

      <Card title="ستون‌های لینک فوتر">
        <div className="grid gap-3 sm:grid-cols-3">
          {siteContent.footer.columns.map((column) => (
            <div key={column.title} className="rounded-2xl border border-slate-200/70 p-4">
              <p className="text-[12px] font-bold text-[#0a1b33]">{column.title}</p>
              <div className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <p key={link.label} className="text-[11.5px] text-slate-500">
                    {link.label} <span className="font-latin text-slate-300">{link.href}</span>
                  </p>
                ))}
              </div>
              <div className="mt-3">
                <Button variant="ghost">ویرایش ستون</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="مزیت‌ها و آمار صفحهٔ اصلی">
        <div className="grid gap-3 sm:grid-cols-2">
          {siteContent.features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200/70 p-4">
              <Field label="عنوان" defaultValue={feature.title} />
              <div className="mt-3">
                <Field label="توضیح" textarea rows={3} defaultValue={feature.body} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {siteContent.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200/70 p-4">
              <Field label={stat.label} defaultValue={stat.value} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button>ذخیرهٔ همهٔ متن‌ها</Button>
        </div>
      </Card>
    </div>
  )
}
