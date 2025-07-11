import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image, User, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "กรุณาใส่ชื่อโครงการ"),
  abstract: z.string().min(10, "บทคัดย่อต้องมีอย่างน้อย 10 ตัวอักษร"),
  researcher: z.string().min(1, "กรุณาใส่ชื่อนักวิจัย"),
  image: z.instanceof(FileList).optional(),
  researchFile: z.instanceof(FileList).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ResearchFormProps {
  onSubmit?: (data: FormData) => void;
}

export default function ResearchForm({ onSubmit }: ResearchFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setValue("image", e.target.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("researchFile", e.target.files);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      console.log("ข้อมูลที่ส่ง:", data);
      
      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลโครงการวิจัยได้ถูกบันทึกแล้ว",
      });

      if (onSubmit) {
        onSubmit(data);
      }

      // Reset form
      reset();
      setImagePreview(null);
      setFileName(null);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-primary-red text-primary-foreground p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">
            แบบฟอร์มเพิ่มข้อมูลงานวิจัย
          </h1>
        </div>

        <Card className="rounded-t-none border-t-0">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              ข้อมูลโครงการวิจัย
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* ชื่อโครงการ */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  ชื่อโครงการ/หัวข้อวิจัย
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="เช่น เครื่องสาวไหมพลังงานแสงอาทิตย์"
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* รูปภาพ */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  รูปภาพโครงการ
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block text-center"
                  >
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-48 object-cover mx-auto rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                          คลิกเพื่อเปลี่ยนรูปภาพ
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          คลิกเพื่อเลือกรูปภาพ หรือลากไฟล์มาวาง
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* บทคัดย่อ */}
              <div className="space-y-2">
                <Label htmlFor="abstract" className="text-sm font-medium">
                  บทคัดย่อ
                </Label>
                <Textarea
                  id="abstract"
                  {...register("abstract")}
                  placeholder="เขียนบทคัดย่อของงานวิจัย อธิบายวัตถุประสงค์ วิธีการ และผลลัพธ์ที่สำคัญ..."
                  className="min-h-32 resize-none"
                />
                {errors.abstract && (
                  <p className="text-destructive text-sm">{errors.abstract.message}</p>
                )}
              </div>

              {/* ข้อมูลนักวิจัย */}
              <div className="space-y-2">
                <Label htmlFor="researcher" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ชื่อนักวิจัย/ผู้จัดทำ
                </Label>
                <Input
                  id="researcher"
                  {...register("researcher")}
                  placeholder="ชื่อ-นามสกุล ของนักวิจัยหรือผู้จัดทำ"
                />
                {errors.researcher && (
                  <p className="text-destructive text-sm">{errors.researcher.message}</p>
                )}
              </div>

              {/* ไฟล์งานวิจัย */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  ไฟล์งานวิจัย (PDF)
                </Label>
                <div className="border border-border rounded-lg p-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex items-center gap-3 text-sm"
                  >
                    <div className="p-2 bg-muted rounded">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      {fileName ? (
                        <p className="text-foreground">{fileName}</p>
                      ) : (
                        <p className="text-muted-foreground">เลือกไฟล์งานวิจัย (PDF, DOC, DOCX)</p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* ปุ่มส่งข้อมูล */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setImagePreview(null);
                    setFileName(null);
                  }}
                  className="px-8"
                >
                  ล้างข้อมูล
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}