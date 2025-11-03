import React, { useEffect, useState } from 'react'
import { getTopUser } from '../../core/services/homepage/fetchgetUserTop'
import { Carousel } from 'react-responsive-carousel'

const ToptravelersComponent = () => {
    const [topUser, setTopUser] = useState([])
    
    const getUserTop = async () => {
        try {
            const data = await getTopUser()
            console.log('Top User', data)
            if( data?.user && Array.isArray(data.user)){
                setTopUser(data.user)
            }
            else{
                setTopUser([])
            }
        } catch (error) {
            console.error("Error", error)
            setTopUser([])
        }
    }
    
    useEffect(() => {
        getUserTop()
    },[])

  return (
<div className="TopTravelersDiv  my-3 ">
  <div className='d-flex justify-content-center titleTopTravelers mb-5'><h2>Top Viajeros</h2></div>
  <div className="containerTravelers">
    <Carousel       
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                infiniteLoop
                swipeable
                emulateTouch
                showArrows={true}
                centerMode={false}
                autoFocus={false}
                useKeyboardArrows
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="carousel-arrow left-arrow"
                    >
                      ‹
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                  hasNext && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="carousel-arrow right-arrow"
                    >
                      ›
                    </button>
                  )
                }
                className="single-card-carousel w-100 position-relative"
              >

    
    {topUser.map((u, idx) => (
      <div key={idx} className="travelerCard">
        <img
          className="rounded-circle me-2 imgCardTravelers"
          src={u.photoProfile}
          alt={u.name}
          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
        />
        <div>
          <span className="fw-semibold">
            {u.name} {u.lastName}
          </span>
        </div>
      </div>
    ))}
    </Carousel>
  </div>
</div>

  )
}

export default ToptravelersComponent
