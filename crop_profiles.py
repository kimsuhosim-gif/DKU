from PIL import Image
import os

# 이미지 경로 (사용자가 새로 업로드한 이미지 경로로 업데이트)
image1_path = r"C:/Users/User/.gemini/antigravity/brain/852b97aa-0a94-4a91-8919-3e98c395b7ec/uploaded_image_1_1768364372578.jpg"
image2_path = r"C:/Users/User/.gemini/antigravity/brain/852b97aa-0a94-4a91-8919-3e98c395b7ec/uploaded_image_0_1768364372578.jpg"
output_dir = r"c:\Users\User\Desktop\최종\GOLF\public\images\profiles"

# 출력 디렉토리 생성
os.makedirs(output_dir, exist_ok=True)

try:
    # 첫 번째 이미지 로드 (11명 단체 사진)
    print(f"Loading image 1: {image1_path}")
    img1 = Image.open(image1_path)
    width1, height1 = img1.size
    print(f"Image 1 size: {width1}x{height1}")

# 첫 번째 이미지는 11명 (5+4+2 레이아웃)
# 대략적인 위치 계산 (픽셀 단위로 조정 필요)
# 첫 줄: 5명 (김영웅, 김효민, 정재엽, 홍지훈, 김도윤)
# 두번째 줄: 4명 (유만종, 김성태, 신연성, 최재호)
# 세번째 줄: 2명 (김성진, 양창운)

# 각 프로필의 대략적인 크기와 위치
profiles_img1 = [
    # 첫 줄 (y: 0~250)
    ("youngwoong", 10, 10, 210, 250),      # 김영웅 (파랑)
    ("hyomin", 220, 10, 450, 270),         # 김효민 (노랑)
    ("jaeyeop", 410, 110, 620, 390),       # 정재엽 (빨강)
    ("jihoon", 620, 10, 810, 250),         # 홍지훈 (초록)
    ("doyoon", 820, 10, 1020, 250),        # 김도윤 (보라)
    
    # 두번째 줄 (y: 250~500)
    ("manjong", 10, 280, 250, 520),        # 유만종 (청록)
    ("sungtae", 270, 410, 500, 650),       # 김성태 (분홍)
    ("yeonseong", 525, 410, 755, 650),     # 신연성 (하늘)
    ("jaeho", 775, 280, 1020, 520),        # 최재호 (연두)
    
    # 세번째 줄 (y: 500~750)
    ("sungjin2", 10, 540, 260, 780),       # 김성진 (베이지)
    ("changwoon", 770, 540, 1020, 780),    # 양창운 (오렌지)
]

# 두 번째 이미지 로드 (3명 단체 사진)
    print(f"Loading image 2: {image2_path}")
    img2 = Image.open(image2_path)
    width2, height2 = img2.size
    print(f"Image 2 size: {width2}x{height2}")

# 두 번째 이미지는 3명 (2+1 레이아웃)
profiles_img2 = [
    # 첫 줄: 2명
    ("kyungjun", 15, 30, 265, 280),        # 김경준 (보라)
    ("junyoung", 280, 30, 530, 280),       # 김준영 (청록)
    
    # 두번째 줄: 1명
    ("jangpyo", 190, 295, 440, 545),       # 홍장표 (민트)
]

# 첫 번째 이미지 크롭
    for name, x1, y1, x2, y2 in profiles_img1:
        cropped = img1.crop((x1, y1, x2, y2))
        output_path = os.path.join(output_dir, f"{name}.jpg")
        cropped.save(output_path, quality=95)
        print(f"Saved: {output_path}")

    # 두 번째 이미지 크롭
    for name, x1, y1, x2, y2 in profiles_img2:
        cropped = img2.crop((x1, y1, x2, y2))
        output_path = os.path.join(output_dir, f"{name}.jpg")
        cropped.save(output_path, quality=95)
        print(f"Saved: {output_path}")

    print("\n모든 프로필 이미지 크롭 완료!")

except Exception as e:
    print(f"Error occurred: {e}")
    import traceback
    traceback.print_exc()
